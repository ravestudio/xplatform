using CommonLib.Objects;
using Google.Protobuf.WellKnownTypes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tinkoff.InvestApi;
using Tinkoff.InvestApi.V1;

namespace PriceUpdater.commands
{
    public class QuoteSPBLoad
    {
        private readonly InvestApiClient _client = null;
        private readonly RabbitSender _rabbitSender = null;
        public QuoteSPBLoad(InvestApiClient client, RabbitSender rabbitSender) {
            this._client = client;
            this._rabbitSender = rabbitSender;
        }
        public void Exec(string message)
        {
            var quote = System.Text.Json.JsonSerializer.Deserialize<Quote>(message);

            if (quote != null)
            {
                var request = new GetCandlesRequest { Figi = quote.figi, From = DateTime.UtcNow.AddDays(-20).ToTimestamp(), To = DateTime.UtcNow.ToTimestamp(), Interval = CandleInterval.Day };

                var resp = _client.MarketData.GetCandles(request);
                var candles = Utils.CandlesToJson(resp.Candles);

                Quote result = Utils.GetQuoteFromCandles(candles);

                if (result != null)
                {
                    result.Id = quote.Id;
                    result.ISIN = quote.ISIN;
                    result.symbol = quote.symbol;
                    result.Board = quote.Board;
                    result.figi = quote.figi;

                    _rabbitSender.PublishMessage<Quote>(result, "quote.update");

                }

            }
        }
    }
}
