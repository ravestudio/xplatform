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
using System.Linq.Expressions;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Tinkoff.InvestApi;
using Tinkoff.InvestApi.V1;
using Serilog;
using CommonLib.Yahoo;

namespace PriceUpdater
{
    public class RabbitReceiver : IHostedService
    {
        private readonly RabbitMQSettings _rabbitSettings;
        private readonly IModel _channel;
        private readonly RabbitSender _rabbitSender = null;
        private readonly UpdaterStorage _updaterStorage = null;
        private readonly ILogger _logger = null;

        public RabbitReceiver(ILogger logger, RabbitMQSettings rabbitSettings, IModel channel, RabbitSender rabbitSender, UpdaterStorage storage)
        {
            _logger = logger;
            _rabbitSettings = rabbitSettings;
            _rabbitSender = rabbitSender;
            _updaterStorage = storage;
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

            /*var apiClient = new CommonLib.WebApiClient();
            apiClient.addHeader("Authorization", "Bearer t.hAFDFeeTzLR_tlTz9H7S406ecutXFe21HljCDGf7sm_DRIYTDesfGlkS5P5ohNcZ_0tZUwHKgdhvMXhoRO0iYw");
            CommonLib.Tinkoff.TinkoffClient _tinkoffClient = new CommonLib.Tinkoff.TinkoffClient(apiClient);*/

            MicexISSClient micexClient = new MicexISSClient(new CommonLib.WebApiClient());


            var apiYahooClient = new CommonLib.WebApiClient();
            /*apiYahooClient.addHeader("x-rapidapi-host", "apidojo-yahoo-finance-v1.p.rapidapi.com");
            apiYahooClient.addHeader("x-rapidapi-key", "d8c3e2c892msh13cac0704b75eb0p115a47jsn5be47ce5097d");*/

            apiYahooClient.addHeader("x-rapidapi-host", "yahoo-finance160.p.rapidapi.com");
            apiYahooClient.addHeader("x-rapidapi-key", "d8c3e2c892msh13cac0704b75eb0p115a47jsn5be47ce5097d");
            YahooV2Client yahooClient = new YahooV2Client(apiYahooClient);


            _channel.ExchangeDeclare(exchange: _rabbitSettings.ExchangeName,
                        type: _rabbitSettings.ExchangeType);

            var queueName = _channel.QueueDeclare().QueueName;

            _channel.QueueBind(queue: queueName, exchange: _rabbitSettings.ExchangeName, routingKey: "quote.#.load");
            _channel.QueueBind(queue: queueName, exchange: _rabbitSettings.ExchangeName, routingKey: "state.#.update");
            _channel.QueueBind(queue: queueName, exchange: _rabbitSettings.ExchangeName, routingKey: "yahoo.financial");
            _channel.QueueBind(queue: queueName, exchange: _rabbitSettings.ExchangeName, routingKey: "dividend.load");

            var consumerAsync = new AsyncEventingBasicConsumer(_channel);

            consumerAsync.Received += async (_, ea) =>
            {
                var body = ea.Body.ToArray();
                var message = Encoding.UTF8.GetString(body);

                try
                {
                    if (ea.RoutingKey == "quote.china.load" || ea.RoutingKey == "quote.usa.load")
                    {
                        var command = new QuoteSPBLoad(client, _rabbitSender);

                        command.Exec(message);
                    }

                    if (ea.RoutingKey == "quote.moscow.load")
                    {

                        var command = new QuoteMoscowLoad(micexClient, _rabbitSender);

                        var res = await command.Exec(message);
                    }

                    if (ea.RoutingKey == "state.quote.update")
                    {
                        var command = new StateQuoteUpdate(_updaterStorage);
                        var res = command.Exec(message);
                    }

                    if (ea.RoutingKey == "state.security.update")
                    {
                        var command = new StateSecurityUpdate(_updaterStorage);
                        var res = command.Exec(message);
                    }

                    if (ea.RoutingKey == "state.yahooFinancial.update")
                    {
                        var command = new StateYahooFinancialUpdate(_updaterStorage);
                        var res = command.Exec(message);
                    }

                    if (ea.RoutingKey == "yahoo.financial")
                    {
                        var command = new FinancialV2Load(yahooClient, _rabbitSender);
                        var res = command.Exec(message);
                    }

                    if (ea.RoutingKey == "dividend.load")
                    {
                        var command = new DividendLoad(client, _rabbitSender);
                        command.Exec(message);
                    }
                }
                catch (Exception ex)
                {
                    _logger.Error(ex, string.Format("{0}", ea.RoutingKey));
                }

                _channel.BasicAck(ea.DeliveryTag, false);
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
