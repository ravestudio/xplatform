using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CommonLib.Yahoo;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using xplatform.DataAccess;
using xplatform.Model;

namespace xplatform.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class YahooController : ControllerBase
    {
        private readonly XContext _context;
        public YahooController(XContext context)
        {
            _context = context;
        }

        [HttpGet("{Code}")]
        public IActionResult Get(string Code)
        {
            var financials = _context.FinanceAnnualSet.Where(f => f.Code == Code)
                .OrderByDescending(f => f.Year).Take(5).ToList();

            JObject report = new JObject(
                new JProperty("incomeStatementHistory",
                    new JArray(financials.Select(f => JObject.Parse(f.Data)["incomeStatement"]))),
                new JProperty("balanceSheetHistory",
                    new JArray(financials.Select(f => JObject.Parse(f.Data)["balanceSheet"]))),
                new JProperty("cashflowStatementHistory",
                    new JArray(financials.Select(f => JObject.Parse(f.Data)["cashflowStatement"]))),
                new JProperty("years", financials.Select(f => f.Year)));

            /*for (int i = 0; i < financials.Count; i++)
            {
                report["incomeStatementHistory"]["incomeStatement"] = obj["financialsTemplate"];
            }*/

            return new ContentResult
            {
                Content = report.ToString(),
                ContentType = "application/json"
            };
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody]YahooRequest request)
        {

            if (request.Type == "process")
            {
                var raw = _context.YahooFinanceRawSet.FirstOrDefault(y => y.Code == request.Code && y.Processed == false);

                JObject obj = JObject.Parse(raw.Data);

                System.DateTime dateTime = new System.DateTime(1970, 1, 1, 0, 0, 0, 0);

                IList<CommonLib.Objects.FinanceAnnual> _reports = obj["timeSeries"]["timestamp"]
                    .Select(s => new CommonLib.Objects.FinanceAnnual()
                {
                    Id = Guid.NewGuid(),
                    Code = request.Code,
                    CreateDate = DateTime.Now,
                    Data = "",
                    Year = dateTime.AddSeconds((int)s).Year
                })
                    .OrderByDescending(r => r.Year)
                    .ToList();

                for(int i =0; i < _reports.Count; i ++)
                {
                    JObject report = new JObject();
                    report["financialsTemplate"] = obj["financialsTemplate"];
                    report["incomeStatement"] = obj["incomeStatementHistory"]["incomeStatementHistory"][i];
                    report["balanceSheet"] = obj["balanceSheetHistory"]["balanceSheetStatements"][i];
                    report["cashflowStatement"] = obj["cashflowStatementHistory"]["cashflowStatements"][i];
                    _reports[i].Data = report.ToString();
                }

                foreach(var rep in _reports)
                {
                    if (_context.FinanceAnnualSet.Count(f => f.Code == rep.Code && f.Year == rep.Year) == 0)
                    {
                        _context.FinanceAnnualSet.Add(rep);
                    }
                }
                
                raw.Processed = true;
                _context.SaveChanges();
            }

            if (request.Type == "financial")
            {


                var apiClient = new CommonLib.WebApiClient();
                YahooClient yahooClient = new YahooClient(apiClient);

                apiClient.addHeader("x-rapidapi-host", "apidojo-yahoo-finance-v1.p.rapidapi.com");
                apiClient.addHeader("x-rapidapi-key", "d8c3e2c892msh13cac0704b75eb0p115a47jsn5be47ce5097d");

                string resp = await yahooClient.GetFinancial(request.Code);

                JObject obj = JObject.Parse(resp);

                int max_timestamp = obj["timeSeries"]["timestamp"].Select(s => (int)s).Max();

                System.DateTime dateTime = new System.DateTime(1970, 1, 1, 0, 0, 0, 0);

                _context.YahooFinanceRawSet.Add(new CommonLib.Objects.YahooFinanceRaw()
                {
                    Id = Guid.NewGuid(),
                    Data = resp,
                    LoadDate = DateTime.Now,
                    Processed = false,
                    Code = request.Code,
                    LastFinance = dateTime.AddSeconds(max_timestamp)
                });

                _context.SaveChanges();

            }


            return Ok();
        }
    }
}