using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CommonLib.ISS;
using CommonLib.Objects;
using Iot.Device.Max31856;
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

            var finance = from annual in _context.FinanceAnnualSet group annual by annual.Code into g select new { Code = g.Key, year = (from t2 in g select t2.Year).Max() };

            Func<IList<Quote>, string, decimal> getPrice = new Func<IList<Quote>, string, decimal>((quotes, isin) =>
            {
                var quote = quotes.SingleOrDefault(q => q.ISIN == isin);
                return quote.price == 0 && quote.previousClose > 0? quote.previousClose : quote.price;
            });

            Func<IList<Quote>, string, decimal> getPriceChange = new Func<IList<Quote>, string, decimal>((quotes, isin) =>
            {
                Quote quote = quotes.Single(q => q.ISIN == isin);

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
                Price = getPrice(quotes, s.ISIN),
                PriceChange = getPriceChange(quotes, s.ISIN),
                Sector = s.Emitent.EmitentProfile != null ? (string)JObject.Parse(s.Emitent.EmitentProfile.Data)["sector"] : null,
                LastFinancial = finance.SingleOrDefault(f => f.Code == s.Emitent.FinancialPage).year
            }).ToArray();
        }

        //private static decimal GetPrice(List<Quote> quotes, string symbol)
        //{
        //    return quotes.Single(q => q.symbol == symbol).price;
        //}
    }
}