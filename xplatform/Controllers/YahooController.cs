using System;
using System.Collections.Generic;
using System.Linq;
using System.Security;
using System.Threading.Tasks;
using CommonLib.Objects;
using CommonLib.Yahoo;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using xplatform.DataAccess;
using xplatform.Model;
//using Serilog;

namespace xplatform.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class YahooController : ControllerBase
    {
        private readonly XContext _context;
        //private readonly ILogger _logger = null;
        public YahooController(XContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IEnumerable<object> Get()
        {
            var first = from security in _context.SecuritySet.Where(r => !string.IsNullOrEmpty(r.FinancialPage))

                        join finRaw in _context.YahooFinanceRawSet on security.FinancialPage equals finRaw.Code into grouping
                        from p in grouping.DefaultIfEmpty()
                        orderby security.FinancialPage, p.LoadDate descending
                        select new
                        {
                            code = security.FinancialPage,
                            name = security.Name,
                            region = security.Region,
                            loadDate = p.LoadDate,
                            lastFinance = p.LastFinance,
                            status = (FinanceProcessEnum?)p.Status
                        };

            var list = first.ToList().GroupBy(x => x.code)
               .SelectMany(g =>
                   g.Select((j, i) => new { j.code, j.name, j.region, j.loadDate, j.lastFinance, status = j.status > 0 ? j.status.ToString() : null, rn = i + 1 })
               ).Where(r => r.rn == 1);


            return list;
        }

        [HttpGet("{Code}")]
        public IActionResult Get(string Code)
        {

            //все акции по эмитенту
            var q_security = from sec in _context.SecuritySet join sec2 in _context.SecuritySet on sec.EmitentId equals sec2.EmitentId where sec2.FinancialPage == Code && sec.Type == "stock" select sec;

            var securityList = q_security.Include(s => s.SecurityStatistics).Include(s => s.FinancialData).Include(s=> s.Emitent).ThenInclude(e => e.EmitentProfile).ToList();

            var security = securityList.Single(s => s.FinancialPage == Code);

            Quote quote = _context.QuoteSet.Single(q => q.ISIN == security.ISIN);

            IList<Quote> currencies = _context.QuoteSet.Where(q => q.Board == "CETS").ToList();

            var financials = _context.FinanceAnnualSet.Where(f => f.Code == security.Emitent.FinancialPage)
                .OrderByDescending(f => f.Year).Take(5).ToList();

            JObject report = new JObject(

                new JProperty("emitent", security.Name),
                new JProperty("isin", security.ISIN),
                new JProperty("quote", JObject.FromObject(quote)),
                new JProperty("currencies", JArray.FromObject(currencies)),
                new JProperty("financialPage", security.FinancialPage),

                new JProperty("assetProfile", security.Emitent.EmitentProfile != null? JObject.Parse(security.Emitent.EmitentProfile.Data): null),
                //new JProperty("defaultKeyStatistics", security.SecurityStatistics != null ? JObject.Parse(security.SecurityStatistics.Data) : null),

                new JProperty("defaultKeyStatistics", new JArray(
                    securityList.Where(s => s.SecurityStatistics != null)
                    .Select(s => {
                        var jobj = JObject.Parse(s.SecurityStatistics.Data);
                        jobj["code"] = s.FinancialPage;
                        return jobj;
                        })
                    )
                ),

                new JProperty("financialData", security.FinancialData != null ? JObject.Parse(security.FinancialData.Data) : null),

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
        public async Task<IActionResult> Post([FromBody] YahooRequest request)
        {

            if (request.Type == "process")
            {
                Func<DateTime, int> getFinYear = (endDate) =>
                {
                    //финансовый год считаем завершенным до 15 января следующего года
                    return endDate.Month > 1 || endDate.Day > 15 ? endDate.Year : endDate.Year -1;
                };

                foreach (string code in request.Codes)
                {
                    var raw = _context.YahooFinanceRawSet.FirstOrDefault(y => y.Code == code && y.Status == FinanceProcessEnum.Loaded);

                    var security = _context.SecuritySet
                        .Include(s => s.SecurityStatistics)
                        .Include(s => s.FinancialData)
                        .Include(s => s.Emitent).ThenInclude(e => e.EmitentProfile).SingleOrDefault(x => x.FinancialPage == code);

                    JObject obj = JObject.Parse(raw.Data);

                    System.DateTime dateTime = new System.DateTime(1970, 1, 1, 0, 0, 0, 0);

                    IList<CommonLib.Objects.FinanceAnnual> _reports = obj["incomeStatementHistory"]["incomeStatementHistory"]
                        .Select(s => new CommonLib.Objects.FinanceAnnual()
                        {
                            Id = Guid.NewGuid(),
                            Code = security.Emitent.FinancialPage,
                            CreateDate = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc),
                            Data = "",
                            Year = getFinYear(dateTime.AddSeconds((int)s["endDate"]["raw"]))
                        })
                        .OrderByDescending(r => r.Year)
                        .ToList();

                    for (int i = 0; i < _reports.Count; i++)
                    {
                        JObject report = new JObject();
                        //report["financialsTemplate"] = obj["financialsTemplate"];
                        report["incomeStatement"] = obj["incomeStatementHistory"]["incomeStatementHistory"][i];
                        report["balanceSheet"] = obj["balanceSheetHistory"]["balanceSheetStatements"][i];
                        report["cashflowStatement"] = obj["cashflowStatementHistory"]["cashflowStatements"][i];
                        _reports[i].Data = report.ToString();
                    }


                    if (obj["assetProfile"] != null)
                    {
                        if (security.Emitent.EmitentProfile == null)
                        {
                            security.Emitent.EmitentProfile = new EmitentProfile();
                        }

                        security.Emitent.EmitentProfile.Data = obj["assetProfile"].ToString();
                        security.Emitent.EmitentProfile.CreateDate = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc);
                    }

                    if (obj["financialData"] != null)
                    {
                        if (security.FinancialData == null)
                        {
                            security.FinancialData = new FinancialData();
                        }

                        security.FinancialData.Data = obj["financialData"].ToString();
                        security.FinancialData.CreateDate = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc);
                    }

                    if (obj["defaultKeyStatistics"] != null)
                    {
                        if (security.SecurityStatistics == null)
                        {
                            security.SecurityStatistics = new SecurityStatistics();
                        }

                        security.SecurityStatistics.Data = obj["defaultKeyStatistics"].ToString();
                        security.SecurityStatistics.CreateDate = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc);
                    }


                    foreach (var rep in _reports)
                    {
                        var annual = _context.FinanceAnnualSet.SingleOrDefault(f => f.Code == rep.Code && f.Year == rep.Year);

                        //удалить старый отчет
                        if (annual != null)
                        {
                            _context.FinanceAnnualSet.Remove(annual);
                        }

                        /*if (_context.FinanceAnnualSet.Count(f => f.Code == rep.Code && f.Year == rep.Year) == 0)
                        {
                            _context.FinanceAnnualSet.Add(rep);
                        }*/
                        _context.FinanceAnnualSet.Add(rep);
                    }

                    raw.Status = FinanceProcessEnum.Processed;
                    _context.SaveChanges();
                }
            }

            if (request.Type == "financial")
            {


                var apiClient = new CommonLib.WebApiClient();
                YahooClient yahooClient = new YahooClient(apiClient);

                //private
                //apiClient.addHeader("x-rapidapi-host", "apidojo-yahoo-finance-v1.p.rapidapi.com");

                apiClient.addHeader("x-rapidapi-host", "yahoo-finance15.p.rapidapi.com");
                apiClient.addHeader("x-rapidapi-key", "d8c3e2c892msh13cac0704b75eb0p115a47jsn5be47ce5097d");
                //apiClient.addHeader("x-rapidapi-key", "b8d1c121d0msh69fd766be55dc0dp14f915jsn18df02435e1a");


                foreach (string code in request.Codes)
                {
                    /*YahooFinanceRaw raw = _context.YahooFinanceRawSet.FirstOrDefault(y => y.Code == code && y.Status == FinanceProcessEnum.Init);

                    if (raw.LoadDate.HasValue)
                    {
                        continue;
                    }*/


                    //raw.LoadDate = DateTime.Now;
                    //_context.SaveChanges();


                    try
                    {
                        //_logger.Information($"financial request: {code}");

                        string resp = await yahooClient.GetFinancial(code);

                        JObject obj = JObject.Parse(resp);

                        int max_timestamp = obj["incomeStatementHistory"]["incomeStatementHistory"].Select(s => (int)s["endDate"]["raw"]).Max();

                        System.DateTime dateTime = DateTime.SpecifyKind(new System.DateTime(1970, 1, 1, 0, 0, 0, 0), DateTimeKind.Utc);

                        YahooFinanceRaw raw = _context.YahooFinanceRawSet.FirstOrDefault(y => y.Code == code && y.Status == FinanceProcessEnum.Init);
                        raw.Data = resp;
                        raw.LoadDate = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc);
                        raw.Status = FinanceProcessEnum.Loaded;
                        raw.LastFinance = dateTime.AddSeconds(max_timestamp);

                    }
                    catch(Exception ex)
                    {
                        YahooFinanceRaw raw = _context.YahooFinanceRawSet.FirstOrDefault(y => y.Code == code && y.Status == FinanceProcessEnum.Init);
                        raw.LoadDate = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc);
                    }

                    _context.SaveChanges();
                }

            }

            if (request.Type == "init")
            {
                foreach (string code in request.Codes)
                {
                    _context.YahooFinanceRawSet.Add(new CommonLib.Objects.YahooFinanceRaw()
                    {
                        Id = Guid.NewGuid(),
                        Status = FinanceProcessEnum.Init,
                        Code = code,
                    });
                }

                _context.SaveChanges();
            }


            return Ok();
        }
    }
}