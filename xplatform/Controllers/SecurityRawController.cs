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

            MicexISSClient micexClient = new MicexISSClient(new CommonLib.WebApiClient());

            var apiClient = new CommonLib.WebApiClient();
            TinkoffClient tinkoffClient = new TinkoffClient(apiClient);

            apiClient.addHeader("Authorization", "Bearer t.FwRjwQy5LHo3uXE0iQ6D4VGVFRvccr1_PItEHgLIOt4sc7QkQkBzd_eDACB0TTfnBBOWi_mtg84cPbvKwD4gpQ");

            string tinkoff_stocks = await tinkoffClient.GetStocks();

            string moex_json = await micexClient.GetSecurityList("shares", "TQBR");

            JObject obj = JObject.Parse(tinkoff_stocks);
            JObject moexObj = JObject.Parse(moex_json);

            JArray instruments = (JArray)obj["payload"]["instruments"];
            JArray moex_data = (JArray)moexObj["securities"]["data"];

            IList<string> moex_columns = moexObj["securities"]["columns"].Select(c => (string)c).ToList();

            int isin_column = moex_columns.IndexOf("ISIN");
            IList<string> moex_isin = moex_data.Select(t => (string)t[isin_column]).ToList();


            foreach (var jtoken in instruments)
            {
                SecurityRaw raw = jtoken.ToObject<SecurityRaw>();
                raw.Board = moex_isin.Contains(raw.isin) ? "TQBR" : "SPBMX";

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