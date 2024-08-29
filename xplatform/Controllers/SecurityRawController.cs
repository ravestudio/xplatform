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
using Tinkoff.InvestApi;
using Tinkoff.InvestApi.V1;
using System.Diagnostics.Metrics;

namespace xplatform.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize]
    public class SecurityRawController : ControllerBase
    {
        private readonly XContext _context;

        public SecurityRawController(XContext context)
        {
            _context = context;
        }
        [HttpGet]
        public IEnumerable<SecurityRaw> Get()
        {
            return _context.SecurityRawSet.ToList();

        }

        [HttpPost]
        public async Task<IActionResult> Post()
        {
            var client = InvestApiClientFactory.Create("t.hAFDFeeTzLR_tlTz9H7S406ecutXFe21HljCDGf7sm_DRIYTDesfGlkS5P5ohNcZ_0tZUwHKgdhvMXhoRO0iYw");

            Func<string, string> getBoard = currency =>
            {
                if (currency == "HKD") return "SPBHKEX";

                if (currency == "RUB") return "TQBR";

                return "SPBXM";
            };

            var resp = client.Instruments.Shares();

            var instruments = resp.Instruments;

            

            Console.WriteLine("drop unused");

            foreach (var raw in _context.SecurityRawSet.Where(raw => raw.Processed == false))
            {
                _context.SecurityRawSet.Remove(raw);
                Console.WriteLine($"deleted \t{raw.isin} \t{raw.ticker} \t{raw.Processed}");
            }

            _context.SaveChanges();



            IList<SecurityRaw> rawList = _context.SecurityRawSet.ToList();

            //check old
            Console.WriteLine("Check Processed");
            foreach (var raw in rawList.Where(r => r.Processed))
            {
                var inst = instruments.Where(i => i.Isin == raw.isin && i.ClassCode == raw.Board);

                if (inst?.Count() == 0)
                {
                    Console.WriteLine($"{raw.isin} {raw.figi} {raw.ticker} {raw.name} {raw.Processed} not found in api");

                }

                if (inst?.Count() > 1)
                {
                    Console.WriteLine($"{raw.isin} {raw.ticker} {raw.name} {raw.Processed} doublicate in api");

                }
            }


            //add new

            string[] supportedCurrencies = { "HKD", "RUB", "USD" };


            foreach (var share in instruments)
            {
                var old = _context.SecurityRawSet.SingleOrDefault(r => r.isin == share.Isin);

                if (old != null) continue;

                var doubles = instruments.Where(i => i.Isin == share.Isin).ToList();

                if (doubles.Count() > 1 && share.Exchange == "unknown") continue;


                var raw = new SecurityRaw();

                if (share.Isin == share.Ticker) continue;

                if (!supportedCurrencies.Contains(share.Currency.ToUpper())) continue;
               
                raw.isin = share.Isin;
                raw.figi = share.Figi;
                raw.ticker = share.Ticker;
                raw.name = share.Name;
                raw.Board = getBoard(share.Currency.ToUpper());
                raw.type = "Stock";
                raw.minPriceIncrement = share.MinPriceIncrement;
                raw.lot = share.Lot;
                raw.currency = share.Currency.ToUpper();

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