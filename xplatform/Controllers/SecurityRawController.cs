using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CommonLib.ISS;
using CommonLib.Objects;
using CommonLib.Tinkoff;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using xplatform.DataAccess;
using xplatform.Model;
using Microsoft.EntityFrameworkCore;

namespace xplatform.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class SecurityRawController : ControllerBase
    {
        private readonly XContext _context;

        public SecurityRawController(XContext context)
        {
            _context = context;
        }
        public IEnumerable<SecurityRaw> Get()
        {
            return _context.SecurityRawSet.ToList();

        }

        [HttpPost]
        public async Task<IActionResult> Post()
        {
            Func<string, string> getBoard = currency =>
            {
                if (currency == "HKD") return "SPBHKEX";

                if (currency == "RUB") return "TQBR";

                return "SPBXM";
            };

            MicexISSClient micexClient = new MicexISSClient(new CommonLib.WebApiClient());

            var apiClient = new CommonLib.WebApiClient();
            TinkoffClient tinkoffClient = new TinkoffClient(apiClient);

            apiClient.addHeader("Authorization", "Bearer t.hAFDFeeTzLR_tlTz9H7S406ecutXFe21HljCDGf7sm_DRIYTDesfGlkS5P5ohNcZ_0tZUwHKgdhvMXhoRO0iYw");

            string tinkoff_stocks = await tinkoffClient.GetStocks();

            JObject obj = JObject.Parse(tinkoff_stocks);

            JArray instruments = (JArray)obj["payload"]["instruments"];

            string[] supportedCurrencies = { "HKD", "RUB", "USD" };


            foreach (var jtoken in instruments)
            {
                SecurityRaw raw = jtoken.ToObject<SecurityRaw>();

                if (raw.isin == raw.ticker) continue;

                if (!supportedCurrencies.Contains(raw.currency)) continue;
               

                raw.Board = getBoard(raw.currency);

                Security sec = _context.SecuritySet.Include(s => s.Emitent).SingleOrDefault(c => c.ISIN == raw.isin);
                if (sec != null)
                {
                    raw.Processed = true;
                    raw.Emitent = sec.Emitent.Code;
                };

                if (!_context.SecurityRawSet.Any(r => r.isin == raw.isin))
                {
                    _context.SecurityRawSet.Add(raw);

                    
                }

            }

            _context.SaveChanges();



            return Ok();
        }

    }
}