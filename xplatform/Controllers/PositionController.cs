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
    [Route("api/[controller]")]
    [ApiController]
    public class PositionController : ControllerBase
    {
        private readonly XContext _context;
        public PositionController(XContext context)
        {
            _context = context;
        }

        [HttpPost]
        public IActionResult Post()
        {
            //calculate all

            _context.Database.ExecuteSqlCommand("TRUNCATE TABLE \"SnapshootSet\"");
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
                snap.increse(deal.accountId, deal.security.Code, deal.Date.Date, deal.Count);
            };

            Action<PortfolioSnapshoot, Deal> decrease = (snap, deal) =>
            {
                snap.decrease(deal.accountId, deal.security.Code, deal.Date.Date, deal.Count);
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
                    ChangeDate = snapshootIndex.Single(kv => kv.Value == index).Key,
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