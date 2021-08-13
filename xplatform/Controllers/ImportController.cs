using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using CommonLib.Objects;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using xplatform.DataAccess;
using xplatform.Model;

namespace xplatform.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ImportController : ControllerBase
    {

        private readonly XContext _context;

        public ImportController(XContext context)
        {
            _context = context;
        }

        [HttpPost]
        public IActionResult Post([FromBody] ImportRequest requestModel)
        {
            if (requestModel.Object == "deal")
            {
                var dealRaws = _context.DealRawSet.ToList();
                var accounts = _context.AccountSet.ToList();

                foreach (DealRaw rawItem in dealRaws)
                {

                    var security = _context.SecuritySet.Single(s => s.Code == rawItem.symbol);

                    Deal deal = new Deal()
                    {
                        Number = rawItem.number,
                        Operation = rawItem.operation == "Купля" ? OrderOperationEnum.Buy : OrderOperationEnum.Sell,
                        securityId = security.Id,
                        accountId = accounts.Single(a => a.Client == rawItem.client).Id,
                        Board = rawItem.board,
                        Date = DateTime.ParseExact($"{rawItem.date} {rawItem.time}", "dd.MM.yyyy HH:mm:ss", CultureInfo.InvariantCulture),
                        DeliveryDate = DateTime.ParseExact(rawItem.delivery_date, "dd.MM.yyyy", CultureInfo.InvariantCulture),
                        Count = rawItem.count,
                        Price = rawItem.price,
                        Volume = rawItem.volume,
                        NKD = security.Market == "bonds" ? rawItem.nkd : null
                    };

                    _context.DealSet.Add(deal);

                }

                _context.SaveChanges();


            }

            if (requestModel.Object == "stock")
            {
                foreach (string isin in requestModel.ISIN)
                {
                    Emitent emitent = null;

                    SecurityRaw rawItem = _context.SecurityRawSet.Single(s => s.isin == isin);

                    if (string.IsNullOrEmpty(rawItem.Emitent))
                    {
                        emitent = new Emitent()
                        {
                            Code = rawItem.ticker,
                            Name = rawItem.name,
                            FinancialPage = rawItem.Board == "SPBMX" ? rawItem.ticker : $"{rawItem.ticker}.ME"
                        };
                    }
                    else emitent = _context.EmitentSet.Single(e => e.Code == rawItem.Emitent);

                    Share stock = new Share()
                    {
                        Emitent = emitent,
                        ISIN = rawItem.isin,
                        Code = rawItem.ticker,
                        Name = rawItem.name,
                        Region = rawItem.Board == "SPBMX" ? "United States" : "Moscow",
                        Currency = rawItem.currency,
                        Market = "shares",
                        Board = rawItem.Board

                    };

                    Quote quote = new Quote()
                    {
                        Id = Guid.NewGuid(),
                        figi = rawItem.figi,
                        symbol = rawItem.ticker,
                        Board = rawItem.Board
                    };

                    _context.ShareSet.Add(stock);
                    _context.QuoteSet.Add(quote);


                    rawItem.Processed = true;
                    rawItem.Emitent = emitent.Code;

                    _context.SecurityRawSet.Update(rawItem);

                    _context.SaveChanges();
                }

            }

            if (requestModel.Object == "indexChanges")
            {
                var changes = _context.MarketIndexChangesSet.Where(i => i.Processed == false && i.Date < DateTime.Now).ToList();

                foreach (MarketIndexChanges indexChanges in changes)
                {
                    JObject data = JObject.Parse(indexChanges.Data);

                    IList<string> addition = data["addition"].Select(c => (string)c).ToList();
                    IList<string> deletion = data["deletion"].Select(c => (string)c).ToList();

                    foreach (string add in addition)
                    {
                        _context.MarketIndexComponentSet.Add(new MarketIndexComponent()
                        {
                            Id = Guid.NewGuid(),
                            Code = add,
                            MarketIndexId = indexChanges.MarketIndexId,
                        });
                    }

                    foreach (string del in deletion)
                    {
                        var constituent = _context.MarketIndexComponentSet.SingleOrDefault(c => c.MarketIndexId == indexChanges.MarketIndexId && c.Code == del);

                        if (constituent != null) {
                            _context.MarketIndexComponentSet.Remove(constituent);
                        }
                    }

                    indexChanges.Processed = true;

                    _context.SaveChanges();

                }
            }

            return Ok();
        }
    }
}