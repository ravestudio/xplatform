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

            var values = _context.SecuritySet.Where(s => s.Market == "shares" && s.Region == "Moscow")
                .Select(s => s.Code).ToArray();

            IList<PriceInfo> results = new List<PriceInfo>();

            foreach(string code in values)
            {
                results.Add(GetPrice(code, micexClient));
            }

            return results;
        }

        private PriceInfo GetPrice(string security, MicexISSClient micexClient)
        {
            var quote = _context.QuoteSet.Single(q => q.symbol == security);

            PriceInfo result = null;

            result = new PriceInfo()
            {
                Code = quote.symbol,
                LastPrice = quote.price,
                OpenPrice = quote.open,
                PrevClose = quote.previousClose
            };

            decimal priceChange = result.LastPrice - result.PrevClose;

            result.Change = priceChange != 0 ? Math.Round(priceChange / result.PrevClose * 100, 2) : 0;

            return result;
        }
    }
}