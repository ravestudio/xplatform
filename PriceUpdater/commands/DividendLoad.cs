using CommonLib.Objects;
using Google.Protobuf.WellKnownTypes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tinkoff.InvestApi.V1;
using Tinkoff.InvestApi;
using Messaging.Messages;

namespace PriceUpdater.commands
{
    public class DividendLoad
    {
        private readonly InvestApiClient _client = null;
        private readonly RabbitSender _rabbitSender = null;
        public DividendLoad(InvestApiClient client, RabbitSender rabbitSender)
        {
            this._client = client;
            this._rabbitSender = rabbitSender;
        }
        public void Exec(string message)
        {
            var quote = System.Text.Json.JsonSerializer.Deserialize<Quote>(message);

            if (quote != null)
            {
                var request = new GetDividendsRequest { Figi = quote.figi, From = DateTime.UtcNow.AddYears(-10).ToTimestamp(), To = DateTime.UtcNow.ToTimestamp() };

                var resp = _client.Instruments.GetDividends(request);

                IEnumerable<CommonLib.Objects.Dividend> data = resp.Dividends.Select(div => new CommonLib.Objects.Dividend()
                {
                    dividendNet = (decimal)div.DividendNet,
                    declaredDate = Utils.UnixTimeToDateTime(div.DeclaredDate.Seconds),
                    paymentDate = Utils.UnixTimeToDateTime(div.PaymentDate.Seconds),
                    lastBuyDate = Utils.UnixTimeToDateTime(div.LastBuyDate.Seconds),
                });
                
                _rabbitSender.PublishMessage<Dividends>(new Dividends {
                    ISIN = quote.ISIN,
                    dividends = data,
                }, "dividend.update");

                

            }
        }
    }
}
