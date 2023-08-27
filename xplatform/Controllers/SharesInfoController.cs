using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CommonLib.ISS;
using CommonLib.Objects;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;
using xplatform.DataAccess;
using xplatform.Model;

namespace xplatform.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SharesInfoController : ControllerBase
    {
        private readonly XContext _context;

        public SharesInfoController(XContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IEnumerable<ShareInfo> Get(string region)
        {
            var quotes = _context.QuoteSet.ToList();

            Func<IList<Quote>, string, decimal> getPrice = new Func<IList<Quote>, string, decimal>((quotes, symbol) =>
            {
                var quote = quotes.SingleOrDefault(q => q.symbol == symbol);
                return quote.price == 0 && quote.previousClose > 0? quote.previousClose : quote.price;
            });

            Func<IList<Quote>, string, decimal> getPriceChange = new Func<IList<Quote>, string, decimal>((quotes, symbol) =>
            {
                Quote quote = quotes.Single(q => q.symbol == symbol);

                var price = quote.price == 0 && quote.previousClose > 0 ? quote.previousClose : quote.price;

                decimal priceChange = price - quote.previousClose;

                return priceChange != 0 ? Math.Round(priceChange / quote.previousClose * 100, 2) : 0;
            });

            return _context.SecuritySet
                .Include(s => s.Emitent)
                .ThenInclude(e => e.EmitentProfile)
                .Where(s => new string[] { "stock", "etf" }.Contains(s.Type) && s.Region == region).Select(s => new ShareInfo()
            {
                Code = s.Code,
                Emitent = s.Emitent.Name,
                FinancialPage = s.FinancialPage,
                Currency = s.Currency,
                Price = getPrice(quotes, s.Code),
                PriceChange = getPriceChange(quotes, s.Code),
                Sector = s.Emitent.EmitentProfile != null ? (string)JObject.Parse(s.Emitent.EmitentProfile.Data)["sector"] : null
            }).ToArray();
        }

        //private static decimal GetPrice(List<Quote> quotes, string symbol)
        //{
        //    return quotes.Single(q => q.symbol == symbol).price;
        //}
    }
}