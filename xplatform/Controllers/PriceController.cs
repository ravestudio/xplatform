using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CommonLib.ISS;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using xplatform.DataAccess;
using xplatform.Model;

namespace xplatform.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PriceController : ControllerBase
    {
        private readonly XContext _context;

        public PriceController(XContext context)
        {
            _context = context;
        }

        public IEnumerable<PriceInfo> Get()
        {
            MicexISSClient micexClient = new MicexISSClient(new CommonLib.WebApiClient());

            var values = _context.SecuritySet.Where(s => s.Market == "shares")
                .Select(s => s.Code).ToArray();

            IList<Task<PriceInfo>> tasks = new List<Task<PriceInfo>>();

            foreach(string code in values)
            {
                tasks.Add(GetPrice(code, micexClient));
            }

            Task.WaitAll(tasks.ToArray());

            return tasks.Select(t => t.Result);
        }

        private async Task<PriceInfo> GetPrice(string security, MicexISSClient micexClient)
        {
            ISSResponse issResp = await micexClient.GetSecurityInfo("shares", "TQBR", security);

            var result = new PriceInfo()
            {
                Code = security,
                LastPrice = issResp.MarketData.First().LAST,
                OpenPrice = issResp.MarketData.First().OPEN,
                PrevClose = issResp.SecurityInfo.First().PREVLEGALCLOSEPRICE
            };

            decimal priceChange = result.LastPrice - result.PrevClose;

            result.Change = priceChange != 0 ? Math.Round(priceChange / result.PrevClose * 100, 2) : 0;

            return result;
        }
    }
}