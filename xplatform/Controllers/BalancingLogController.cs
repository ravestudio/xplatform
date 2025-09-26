using Microsoft.AspNetCore.Mvc;
using xplatform.DataAccess;
using Newtonsoft.Json.Linq;
using xplatform.Model;
using Microsoft.EntityFrameworkCore;

namespace xplatform.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BalancingLogController : ControllerBase
    {
        private readonly XContext _context;

        public BalancingLogController(XContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IEnumerable<BalancingLog> Get()
        {
            Func<int, BalancingLogItem> func = dealId =>
            {
                var deal = _context.DealSet.Include(s => s.security).Include(s => s.Account).Single(d => d.Id == dealId);
                return new BalancingLogItem()
                {
                    dealId = deal.Id,
                    code = deal.security.Code,
                    dealNumber = deal.Number,
                    operation = deal.Operation.ToString(),
                    count = deal.Count,
                    price = deal.Price,
                    cost = deal.Volume,
                    account = deal.Account.Name
                };
            };

            var logList = _context.BalancingLogDataSet.ToList();

            var logModel = logList.Select(l => new BalancingLog(l.Id, l.ChangeDate, JObject.Parse(l.Data), func));


            return logModel;
        }
    }
}
