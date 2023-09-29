using CommonLib.ISS;
using CommonLib.Objects;
using Google.Protobuf.WellKnownTypes;
using Messaging;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using PriceUpdater.commands;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Tinkoff.InvestApi;
using Tinkoff.InvestApi.V1;

namespace PriceUpdater
{
    public class RabbitReceiver : IHostedService
    {
        private readonly RabbitMQSettings _rabbitSettings;
        private readonly IModel _channel;
        private readonly RabbitSender _rabbitSender = null;

        public RabbitReceiver(RabbitMQSettings rabbitSettings, IModel channel, RabbitSender rabbitSender)
        {
            _rabbitSettings = rabbitSettings;
            _rabbitSender = rabbitSender;
            _channel = channel;
        }
        public DateTime UnixTimeToDateTime(long unixtime)
        {
            System.DateTime dtDateTime = new DateTime(1970, 1, 1, 0, 0, 0, 0, System.DateTimeKind.Utc);
            dtDateTime = dtDateTime.AddSeconds(unixtime);
            return dtDateTime;
        }
        private string CandlesToJson(IList<HistoricCandle> historic)
        {
            var candles = historic.Select(c => new { o = (decimal)c.Open, c = (decimal)c.Close, time = UnixTimeToDateTime(c.Time.Seconds) }).ToList();

            return JsonConvert.SerializeObject(new { payload = new { candles = candles } });
        }

        private void DoStuff()
        {

            var client = InvestApiClientFactory.Create("t.hAFDFeeTzLR_tlTz9H7S406ecutXFe21HljCDGf7sm_DRIYTDesfGlkS5P5ohNcZ_0tZUwHKgdhvMXhoRO0iYw");

            var apiClient = new CommonLib.WebApiClient();
            apiClient.addHeader("Authorization", "Bearer t.hAFDFeeTzLR_tlTz9H7S406ecutXFe21HljCDGf7sm_DRIYTDesfGlkS5P5ohNcZ_0tZUwHKgdhvMXhoRO0iYw");
            CommonLib.Tinkoff.TinkoffClient _tinkoffClient = new CommonLib.Tinkoff.TinkoffClient(apiClient);

            MicexISSClient micexClient = new MicexISSClient(new CommonLib.WebApiClient());

            Func<string, Quote> GetQuoteFromCandles = new Func<string, Quote>(data =>
            {

                JObject obj = JObject.Parse(data);

                JToken[] candles = null;

                if (obj["payload"]["candles"].Count() < 2)
                {
                    return null;
                }

                candles = obj["payload"]["candles"]
                .OrderByDescending(t => (DateTime)t["time"])
                .Take(2).ToArray();


                return new Quote()
                {
                    open = decimal.Parse((string)candles[0]["o"], CultureInfo.InvariantCulture),
                    price = decimal.Parse((string)candles[0]["c"], CultureInfo.InvariantCulture),
                    previousClose = decimal.Parse((string)candles[1]["c"], CultureInfo.InvariantCulture)
                };

            });

            Func<ISSResponse, Quote> GetQuoteFromISSResponse = new Func<ISSResponse, Quote>(issResp =>
            {
                if (issResp.MarketData.Count > 0 && issResp.SecurityInfo.Count > 0)
                {
                    return new Quote()
                    {

                        open = issResp.MarketData.First().OPEN,
                        price = issResp.MarketData.First().LAST,
                        NKD = issResp.SecurityInfo.First().NKD,
                        previousClose = issResp.SecurityInfo.First().PREVPRICE,

                    };
                }

                return null;
            });


            _channel.ExchangeDeclare(exchange: _rabbitSettings.ExchangeName,
                        type: _rabbitSettings.ExchangeType);

            var queueName = _channel.QueueDeclare().QueueName;

            _channel.QueueBind(queue: queueName, exchange: _rabbitSettings.ExchangeName, routingKey: "quote.#.load");

            var consumerAsync = new AsyncEventingBasicConsumer(_channel);

            consumerAsync.Received += async (_, ea) =>
            {
                var body = ea.Body.ToArray();
                var message = Encoding.UTF8.GetString(body);

                if (ea.RoutingKey == "quote.china.load" || ea.RoutingKey == "qote.usa.load")
                {
                    var command = new QuoteSPBLoad(client, _rabbitSender);

                    command.Exec(message);
                }

                if (ea.RoutingKey == "quote.moscow.load")
                {

                    var command = new QuoteMoscowLoad(micexClient, _rabbitSender);

                    command.Exec(message);
                }
            };

            _channel.BasicConsume(queue: queueName, autoAck: false, consumer: consumerAsync);
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            DoStuff();
            return Task.CompletedTask;
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            _channel.Dispose();
            return Task.CompletedTask;
        }
    }
}
