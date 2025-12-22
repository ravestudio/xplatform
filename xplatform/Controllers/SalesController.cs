using CommonLib.Objects;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using xplatform.DataAccess;
using xplatform.Model;

namespace xplatform.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SalesController : ControllerBase
    {
        private readonly XContext _context;
        public SalesController(XContext context)
        {
            _context = context;
        }

        [HttpGet("{year}")]
        public IEnumerable<object> Index(int year)
        {

            var sales = _context.DealSet.Include(d => d.security)
                .Where(deal => deal.Date.Year == year && deal.Operation == OrderOperationEnum.Sell)
                .Select(deal => new
            {
                deal.security.Code,
                deal.security.ISIN,
                deal.Number,
                deal.Date,
                deal.Count,
                deal.Price,
                deal.Volume,
                deal.accountId,
            }).ToList();

            var salesList = sales.ToList();

            IList<object> result = new List<object>();

            foreach (var salesItem in sales)
            {
                Security security = _context.SecuritySet.Single(s => s.ISIN == salesItem.ISIN);

                var snap = _context.SnapshootSet
                    .Where(snap => DateTime.SpecifyKind(snap.ChangeDate, DateTimeKind.Utc) < DateTime.SpecifyKind(salesItem.Date.AddDays(-1), DateTimeKind.Utc))
                    .OrderByDescending(s => s.ChangeDate)
                    .FirstOrDefault();

                PortfolioSnapshoot portfolioSnapshoot = new PortfolioSnapshoot();
                portfolioSnapshoot.read(snap.Data);

                var account = portfolioSnapshoot.Accounts.Where(acc => acc.Key == salesItem.accountId).SingleOrDefault();


                var queue = portfolioSnapshoot.Accounts.Where(acc => acc.Key == salesItem.accountId)
                                    .Select(a => a.Value.PositionItems.SingleOrDefault(ps => ps.Key == salesItem.ISIN).Value).Single();


                if (queue != null) {

                    decimal cost = 0;
                    decimal tax = 0;

                    int limit = 0;

                    while (limit < salesItem.Count)
                    {
                        var pos = queue.Dequeue();

                        var needLimit = salesItem.Count - limit;

                        var takelimit = needLimit >= pos.Limit ? pos.Limit : needLimit;

                        decimal takeCost = 0;

                        decimal posPrice = pos.Price;
                        decimal salePrice = salesItem.Price;

                        if (security.Type == "bond")
                        {
                            posPrice = (pos.Price / 100) *((Bond)security).NominalPrice;

                            salePrice = (salesItem.Price / 100) * ((Bond)security).NominalPrice;
                        }
                        
                        takeCost = takelimit * posPrice;

                        limit += takelimit;
                        cost += takeCost;

                        TimeSpan difference = salesItem.Date.Subtract(pos.DealDate);

                        if (difference.Days < 365*3)
                        {
                            decimal v = (salePrice * takelimit) - takeCost;

                            tax += v * 0.13m;
                        }

                        
                    }

                    result.Add(new
                    {
                        salesItem.Code,
                        salesItem.ISIN,
                        salesItem.Number,
                        salesItem.Date,
                        salesItem.Price,
                        salesItem.Count,
                        cost,
                        salesItem.Volume,
                        profit = salesItem.Volume - cost,
                        tax,
                        salesItem.accountId
                    });

                }
                

            }
            
            return result;
        }
    }
}
