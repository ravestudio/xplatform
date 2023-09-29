using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CommonLib.Objects;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using xplatform.DataAccess;
using xplatform.Model;

namespace xplatform.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    //[Authorize]
    public class PositionController : ControllerBase
    {
        private readonly XContext _context;
        public PositionController(XContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IEnumerable<object> Get(int? accountId)
        {
            var snap = _context.SnapshootSet.OrderByDescending(s => s.ChangeDate).First();

            PortfolioSnapshoot portfolioSnapshoot = new PortfolioSnapshoot();
            portfolioSnapshoot.read(snap.Data);

            var query = portfolioSnapshoot.Accounts.AsQueryable();

            if (accountId.HasValue)
            {
                query = query.Where(a => a.Key == accountId);
            }
            

            var ds = query.SelectMany(a => a.Value.PositionItems, (a, q) => new
            {
                account = a.Key,
                code = q.Key,
                limit = q.Value.Sum(p => p.Limit)
            }).GroupBy(v => new { v.code }).Select(g => new
            {
                code = g.Key.code,
                limit = g.Sum(p => p.limit)
            }).ToList();

            return ds;
        }
        [HttpGet]
        public IEnumerable<object> GetDetails(string security, int? accountId)
        {
            var snap = _context.SnapshootSet.OrderByDescending(s => s.ChangeDate).First();

            PortfolioSnapshoot portfolioSnapshoot = new PortfolioSnapshoot();
            portfolioSnapshoot.read(snap.Data);

            var query = portfolioSnapshoot.Accounts.AsQueryable();

            if (accountId.HasValue)
            {
                query = query.Where(a => a.Key == accountId);
            }

            var ds = query.SelectMany(a => a.Value.PositionItems, (a, q) => q.Value.Select(t => new
            {
                account = a.Key,
                code = q.Key,
                date = t.DealDate,
                limit = t.Limit,
                price = t.Price
            })).SelectMany(g => g);

            return ds.Where(d => d.code == security);
        }

        [HttpPost]
        public IActionResult Post()
        {
            //calculate all

            _context.Database.ExecuteSqlRaw("TRUNCATE TABLE \"SnapshootSet\"");
            _context.SaveChanges();

            List<PortfolioSnapshoot> snapshoots = new List<PortfolioSnapshoot>();
            IDictionary<DateTime, int> snapshootIndex = new Dictionary<DateTime, int>();

            Func<PortfolioSnapshoot, PortfolioSnapshoot> copySnap = (snap) =>
            {
                PortfolioSnapshoot result = new PortfolioSnapshoot();

                string json = snap.toJson();

                result.read(json);
                //result.PositionItems = snap.PositionItems.ToList();

                return result;
            };

            Func<DateTime, PortfolioSnapshoot> getSnap = (dt) =>
            {
                var _dt = dt.Date;

                PortfolioSnapshoot result = null;

                if (snapshootIndex.ContainsKey(_dt))
                {
                    result = snapshoots[snapshootIndex[_dt]];
                }

                if (!snapshootIndex.ContainsKey(_dt))
                {
                    int lastIndex = snapshootIndex.Values.Max();
                    result = copySnap(snapshoots[lastIndex]);

                    snapshootIndex.Add(_dt, lastIndex + 1);
                    snapshoots.Add(result);
                }

                return result;
            };

            Action<PortfolioSnapshoot, Deal> increase = (snap, deal) =>
            {
                snap.increse(deal.accountId, deal.security.Code, deal.Date.Date, deal.Count, deal.Price);
            };

            Action<PortfolioSnapshoot, Deal> decrease = (snap, deal) =>
            {
                snap.decrease(deal.accountId, deal.security.Code, deal.Date.Date, deal.Count, deal.Price);
            };

            var deals = _context.DealSet.Include(d => d.security)
                 //.Where(d => (d.Date > new DateTime(2017, 01, 18)) && (d.security.Code == "LKOH"))
                 //.OrderBy(d => d.Number).ToList();
                 .OrderBy(d => d.Date).ThenBy(d => d.security.Region).ThenBy(d => d.Number);

            var dates = deals.Select(d => d.Date.Date).Distinct().OrderBy(d => d).ToList();

            snapshoots.Add(new PortfolioSnapshoot());
            snapshootIndex.Add(dates.First(), 0);

            foreach (Deal deal in deals)
            {
                var snap = getSnap(deal.Date);

                if (deal.Operation == OrderOperationEnum.Buy)
                {
                    increase(snap, deal);
                }

                if (deal.Operation == OrderOperationEnum.Sell)
                {
                    decrease(snap, deal);
                }
            }

            foreach (int index in snapshootIndex.Values)
            {
                SnapshootData snapshootData = new SnapshootData()
                {
                    Id = Guid.NewGuid(),
                    ChangeDate = DateTime.SpecifyKind(snapshootIndex.Single(kv => kv.Value == index).Key, DateTimeKind.Utc),
                    Data = snapshoots[index].toJson()
                };

                _context.SnapshootSet.Add(snapshootData);
            }

            _context.SaveChanges();

            string last = snapshoots.Last().toJson();

            return Ok();
        }
    }
}