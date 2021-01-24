using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CommonLib.ISS;
using CommonLib.Objects;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using xplatform.DataAccess;
using xplatform.Model;

namespace xplatform.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PortfolioController : ControllerBase
    {
        private readonly XContext _context;
        public PortfolioController(XContext context)
        {
            _context = context;
        }

        public PortfolioCost Get()
        {
            PortfolioCost result = new PortfolioCost();

            MicexISSClient micexClient = new MicexISSClient(new CommonLib.WebApiClient());

            var snap = _context.SnapshootSet.OrderByDescending(s => s.ChangeDate).First();

            PortfolioSnapshoot portfolioSnapshoot = new PortfolioSnapshoot();
            portfolioSnapshoot.read(snap.Data);

            var ds = portfolioSnapshoot.Accounts.SelectMany(a => a.Value.PositionItems, (a, pos) =>
            new
            {
                account = a.Key,
                limit = pos.Value.Sum(p => p.Limit),
                code = pos.Key
            }).GroupBy(v => new { v.code }).Select(g => new
            {
                code = g.Key.code,
                limit = g.Sum(p => p.limit)
            }).ToList();

            foreach (var el in ds)
            {
                Security security = _context.SecuritySet.Single(s => s.Code == el.code);

                Quote quote = _context.QuoteSet.Single(q => q.symbol == security.Code && q.Board == security.Board);

                //ISSResponse issResp = await micexClient.GetSecurityInfo(security.Market, security.Board, el.code);

                decimal cost = 0m;

                if (security.Market == "shares")
                {
                    cost = quote.price * el.limit;
                }

                if (security.Market == "bonds")
                {
                    cost = (quote.price / 100) *
                        ((Bond)security).NominalPrice * el.limit +
                        el.limit * quote.NKD.Value;
                }

                if (security.Currency == "USD")
                {
                    Quote usdrub = _context.QuoteSet.Single(q => q.symbol == "USD000UTSTOM");
                    cost = cost * usdrub.price;
                }

                result.AddItem(el.code, security.Name, el.limit, cost, security.Type);
            }

            result.SharesTotal = result.Items.Where(i => i.Type == "stock").Sum(s => s.Cost);
            result.BondsTotal = result.Items.Where(i => i.Type == "bond").Sum(s => s.Cost);

            foreach (PortfolioItem etfItem in result.Items.Where(i => i.Type == "etf"))
            {
                var structure = JObject.Parse(_context.ETFSet.Single(s => s.Code == etfItem.Code).Structure);
                decimal bondPrc = structure.Value<decimal>("bond") + structure.Value<decimal>("gold");
                decimal bondCost = etfItem.Cost * (bondPrc / 100);
                decimal stockCost = etfItem.Cost * ((100 - bondPrc) / 100);

                result.SharesTotal += stockCost;
                result.BondsTotal += bondCost;
            }

            result.SharesPerc = Math.Round(result.SharesTotal / (result.SharesTotal + result.BondsTotal) * 100, 2);
            result.BondsPerc = Math.Round(result.BondsTotal / (result.SharesTotal + result.BondsTotal) * 100, 2);

            return result;
        }
    }
}