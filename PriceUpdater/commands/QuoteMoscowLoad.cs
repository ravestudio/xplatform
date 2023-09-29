using CommonLib.ISS;
using CommonLib.Objects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tinkoff.InvestApi;

namespace PriceUpdater.commands
{
    public class QuoteMoscowLoad
    {
        private readonly MicexISSClient _client = null;
        private readonly RabbitSender _rabbitSender = null;

        public QuoteMoscowLoad(MicexISSClient client, RabbitSender rabbitSender)
        {
            this._client = client;
            this._rabbitSender = rabbitSender;
        }
        public async Task<string> Exec(string message)
        {
            var md = System.Text.Json.JsonSerializer.Deserialize<MarketData>(message);

            ISSResponse issResp = await _client.GetSecurityInfo(md.market, md.board, md.ticker);

            Quote result = Utils.GetQuoteFromISSResponse(issResp);

            if (result != null)
            {
                result.Id = md.quote.Id;
                result.figi = md.quote.figi;
                result.symbol = md.quote.symbol;
                result.Board = md.quote.Board;

                _rabbitSender.PublishMessage<Quote>(result, "quote.update");
            }

            return "ok";
        }
    }
}
