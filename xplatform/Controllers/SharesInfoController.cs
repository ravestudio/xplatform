using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CommonLib.ISS;
using CommonLib.Objects;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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

        public IEnumerable<ShareInfo> Get(string region)
        {
            var quotes = _context.QuoteSet.ToList();

            Func<IList<Quote>, string, string, decimal> getPrice = new Func<IList<Quote>, string, string, decimal>((quotes, board, symbol) =>
            {
                return quotes.Single(q => q.Board == board && q.symbol == symbol).price;
            });

            Func<IList<Quote>, string, string, decimal> getPriceChange = new Func<IList<Quote>, string, string, decimal>((quotes, board, symbol) =>
            {
                Quote quote = quotes.Single(q => q.Board == board && q.symbol == symbol);

                decimal priceChange = quote.price - quote.previousClose;

                return priceChange != 0 ? Math.Round(priceChange / quote.previousClose * 100, 2) : 0;
            });

            return _context.SecuritySet.Where(s => s.Market == "shares" && s.Region == region).Select(s => new ShareInfo()
            {
                Code = s.Code,
                Emitent = s.Emitent.Name,
                FinancialPage = s.Emitent.FinancialPage,
                Currency = s.Currency,
                Price = getPrice(quotes, s.Board, s.Code),
                PriceChange = getPriceChange(quotes, s.Board, s.Code)
            }).ToArray();
        }

        //private static decimal GetPrice(List<Quote> quotes, string symbol)
        //{
        //    return quotes.Single(q => q.symbol == symbol).price;
        //}
    }
}