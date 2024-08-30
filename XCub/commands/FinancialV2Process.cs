using CommonLib.Objects;
using Messaging.Messages;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json.Linq;
using System.Globalization;
using XCub.DataAccess;
using XCub.Model;

namespace XCub.commands
{
    public class FinancialV2Process
    {
        private readonly IServiceScopeFactory _scopeFactory;
        public FinancialV2Process(IServiceScopeFactory scopeFactory)
        {
            this._scopeFactory = scopeFactory;
        }
        public void Exec(string message)
        {
            var msg = System.Text.Json.JsonSerializer.Deserialize<Yahoo>(message);

            if (msg != null)
            {

                using (var scope = _scopeFactory.CreateScope())
                {
                    var context = scope.ServiceProvider.GetRequiredService<XContext>();

                    IList<CommonLib.Objects.FinanceAnnual> _reports = new List<CommonLib.Objects.FinanceAnnual>();

                    IDictionary<int, JObject> jreports = new Dictionary<int, JObject>();

                    IDictionary<string, string> propMapp = new Dictionary<string, string> {
                        //income
                        {"TotalRevenue", "totalRevenue"},
                        {"CostOfRevenue", "costOfRevenue" },
                        {"TotalExpenses", "totalOperatingExpenses" },
                        { "GrossProfit", "grossProfit" },
                        {"NetIncome", "netIncome" },
                        //cashflow
                        {"Depreciation", "depreciation"},
                        {"InvestingCashFlow", "totalCashflowsFromInvestingActivities" },
                        {"PurchaseOfPPE", "capitalExpenditures" },
                        {"RepurchaseOfCapitalStock", "repurchaseOfStock" },
                        {"CashDividendsPaid", "dividendsPaid" },

                        {"ChangeInPayable", "changeToLiabilities"},
                        {"ChangeInInventory", "changeToInventory" },
                        {"ChangeInReceivables", "changeToAccountReceivables" },
                        {"ChangeInPrepaidAssets", "changeToOperatingActivities" },

                        //balanceSheet
                        {"CurrentLiabilities", "totalCurrentLiabilities"},
                        {"TotalLiabilitiesNetMinorityInterest", "totalLiab" },
                        {"CurrentAssets", "totalCurrentAssets" },
                        {"TotalAssets", "totalAssets" },
                        {"StockholdersEquity", "totalStockholderEquity" },
                    };

                    Func<DateTime, int> getFinYear = (endDate) =>
                    {
                        //финансовый год считаем завершенным до 15 января следующего года
                        return endDate.Month > 1 || endDate.Day > 15 ? endDate.Year : endDate.Year - 1;
                    };

                    Func<string, string> toCamelCase = (str) =>
                    {
                        return char.ToLowerInvariant(str[0]) + str[1..];
                    };

                //инициализация отчета
                Action<string, int, string> addReport = (code, finYear, endDate) =>
                    {
                        _reports.Add(new CommonLib.Objects.FinanceAnnual()
                        {
                            Id = Guid.NewGuid(),
                            Code = code,
                            CreateDate = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc),
                            Data = "",
                            Year = finYear
                        });

                        var rep = new JObject();
                        rep["incomeStatement"] = new JObject();
                        rep["balanceSheet"] = new JObject();
                        rep["cashflowStatement"] = new JObject();

                        /*rep["incomeStatement"]["endDate"] = (JObject)JToken.FromObject(new ReportValue() { fmt = endDate });
                        rep["balanceSheet"]["endDate"] = (JObject)JToken.FromObject(new ReportValue() { fmt = endDate });
                        rep["cashflowStatement"]["endDate"] = (JObject)JToken.FromObject(new ReportValue() { fmt = endDate });*/
                        
                        rep["incomeStatement"]["endDate"] = endDate;
                        rep["incomeStatement"]["version"] = 2;
                        rep["balanceSheet"]["endDate"] = endDate;
                        rep["balanceSheet"]["version"] = 2;
                        rep["cashflowStatement"]["endDate"] = endDate;
                        rep["cashflowStatement"]["version"] = 2;

                        jreports.Add(finYear, rep);

                    };

                    //заполение параметра отчетов
                    Action<string, string, string, IEnumerable<JProperty>> fillReportProperty = (code, path, propKey, properties) =>
                    {
                        foreach (JProperty prop in properties)
                        {

                            if (prop.Name != "index")
                            {
                                int finYear = getFinYear(DateTime.Parse(prop.Name));

                                if (!_reports.Any(r => r.Year == finYear))
                                {
                                    addReport(code, finYear, prop.Name);
                                }

                                var value = (string)prop.Value;

                                if (decimal.TryParse(value, NumberStyles.Number, CultureInfo.InvariantCulture, out decimal decValue))
                                {
                                    jreports[finYear][path][propKey] = decValue;
                                }

                            }
                        }
                    };

                    Action<string, string, JToken> fillReportPath = (code, pathName, incomeSet) =>
                    {
                        foreach (JObject token in incomeSet)
                        {
                            var properties = token.Properties();

                            string key = (string)properties.Single(p => p.Name == "index").Value;

                            /*if (propMapp.TryGetValue(key, out string targetKey))
                            {
                                fillReportProperty(code, pathName, targetKey, properties);
                            }*/
                            fillReportProperty(code, pathName, key, properties);
                        }
                    };

                    foreach (string code in msg.Codes)
                    {
                        var raw = context.YahooFinanceRawSet.FirstOrDefault(y => y.Code == code && y.Status == FinanceProcessEnum.Loaded);

                        var security = context.SecuritySet
                            .Include(s => s.SecurityStatistics)
                            .Include(s => s.FinancialData)
                            .Include(s => s.Emitent).ThenInclude(e => e.EmitentProfile).SingleOrDefault(x => x.FinancialPage == code);

                        JObject obj = JObject.Parse(raw.Data);

                        System.DateTime dateTime = new System.DateTime(1970, 1, 1, 0, 0, 0, 0);

                        var incomeSet = obj["income"];
                        var cashflowSet = obj["cashflow"];
                        var balanceSet = obj["balance_sheet"];

                        if (incomeSet != null) {

                            fillReportPath(security.Emitent.FinancialPage, "incomeStatement", incomeSet);
                        }

                        if (cashflowSet != null)
                        {
                            fillReportPath(security.Emitent.FinancialPage, "cashflowStatement", cashflowSet);
                        }

                        if (balanceSet != null)
                        {
                            fillReportPath(security.Emitent.FinancialPage, "balanceSheet", balanceSet);
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

                            obj["defaultKeyStatistics"]["version"] = 2;

                            if (security.SecurityStatistics == null)
                            {
                                security.SecurityStatistics = new SecurityStatistics();
                            }

                            security.SecurityStatistics.Data = obj["defaultKeyStatistics"].ToString();
                            security.SecurityStatistics.CreateDate = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc);
                        }

                        foreach (var rep in _reports)
                        {
                            var annual = context.FinanceAnnualSet.SingleOrDefault(f => f.Code == rep.Code && f.Year == rep.Year);

                            //удалить старый отчет
                            /*if (annual != null)
                            {
                                context.FinanceAnnualSet.Remove(annual);
                            }*/

                            if (annual == null)
                            {
                                rep.Data = jreports[rep.Year].ToString();
                                context.FinanceAnnualSet.Add(rep);
                            }
                        }

                        raw.Status = FinanceProcessEnum.Processed;
                        context.SaveChanges();

                        //Console.WriteLine(jreports[2023].ToString());

                    }
                }
            }
        }
    }
}
