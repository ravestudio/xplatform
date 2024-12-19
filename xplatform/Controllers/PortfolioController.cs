using System;
using System.Collections;
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
    [Route("api/[controller]/[action]")]
    [ApiController]
    [Authorize]
    public class PortfolioController : ControllerBase
    {
        private readonly XContext _context;
        public PortfolioController(XContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IEnumerable<Portfolio> GetPortfolioList()
        {
            return _context.PortfolioSet.ToList();
        }

        [HttpGet]
        public PortfolioCost Get(int portfolioId)
        {
            PortfolioCost result = new PortfolioCost();

            MicexISSClient micexClient = new MicexISSClient(new CommonLib.WebApiClient());

            Func<Quote, decimal> getPrice = new Func<Quote, decimal>((quote) =>
            {
                return quote.price == 0 && quote.previousClose > 0 ? quote.previousClose : quote.price;
            });

            var snap = _context.SnapshootSet.OrderByDescending(s => s.ChangeDate).First();

            var accountIds = _context.PortfolioSet.Where(p => p.Id == portfolioId).SelectMany(p => p.PortfolioAccounts, (p, acc) => acc.AccountId);

            var accounts = _context.AccountSet.Where(a => accountIds.Contains(a.Id)).ToList();

            PortfolioSnapshoot portfolioSnapshoot = new PortfolioSnapshoot();
            portfolioSnapshoot.read(snap.Data);

            var ds = portfolioSnapshoot.Accounts.Where(a => accountIds.Contains(a.Key)).SelectMany(a => a.Value.PositionItems, (a, pos) =>
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
                Security security = _context.SecuritySet.Single(s => s.ISIN == el.code);

                Quote quote = _context.QuoteSet.Single(q => q.ISIN == security.ISIN);

                //ISSResponse issResp = await micexClient.GetSecurityInfo(security.Market, security.Board, el.code);

                decimal cost = 0m;
                decimal nkdcost = 0m;

                if (new string[] { "stock", "etf" }.Contains(security.Type))
                {
                    cost = getPrice(quote) * el.limit;
                }

                if (security.Type == "bond")
                {
                    cost = (getPrice(quote) / 100) *
                        ((Bond)security).NominalPrice * el.limit;
                    nkdcost = el.limit * quote.NKD.Value;

                    //купонный доход если в usd
                    if (((Bond)security).NKDCurrency == "USD")
                    {
                        Quote usdrub = _context.QuoteSet.Single(q => q.symbol == "USD000UTSTOM");
                        nkdcost = nkdcost * getPrice(usdrub);
                    }
                }

                if (security.Currency == "USD")
                {
                    Quote usdrub = _context.QuoteSet.Single(q => q.symbol == "USD000UTSTOM");
                    cost = cost * getPrice(usdrub);
                }

                if (security.Currency == "HKD")
                {
                    Quote hkdrub = _context.QuoteSet.Single(q => q.symbol == "HKDRUB_TOM");
                    cost = cost * getPrice(hkdrub);
                }

                result.AddItem(security.ISIN, security.Code, security.Name, el.limit, cost + nkdcost, security.Type);
            }

            result.SharesTotal = result.Items.Where(i => i.Type == "stock").Sum(s => s.Cost);
            result.BondsTotal = result.Items.Where(i => i.Type == "bond").Sum(s => s.Cost);

            foreach (PortfolioItem etfItem in result.Items.Where(i => i.Type == "etf"))
            {
                var structure = JObject.Parse(_context.ETFSet.Single(s => s.ISIN == etfItem.ISIN).Structure);
                decimal bondPrc = structure.Value<decimal>("bond") + structure.Value<decimal>("gold");
                decimal bondCost = etfItem.Cost * (bondPrc / 100);
                decimal stockCost = etfItem.Cost * ((100 - bondPrc) / 100);

                result.SharesTotal += stockCost;
                result.BondsTotal += bondCost;
            }

            foreach(Account account in accounts)
            {
                Quote gldrub = _context.QuoteSet.Single(q => q.symbol == "GLDRUB_TOM");
                
                var cash = JObject.Parse(account.Cash);
                result.BondsTotal += cash.Value<decimal>("RUB");
                result.BondsTotal += cash.Value<decimal>("GLD")* getPrice(gldrub);
            }

            result.SharesPerc = Math.Round(result.SharesTotal / (result.SharesTotal + result.BondsTotal) * 100, 2);
            result.BondsPerc = Math.Round(result.BondsTotal / (result.SharesTotal + result.BondsTotal) * 100, 2);

            return result;
        }
    }
}