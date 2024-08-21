using CommonLib.Objects;
using Messaging.Messages;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json.Linq;
using XCub.DataAccess;


namespace XCub.commands
{
    public class FinancialProcess
    {
        private readonly IServiceScopeFactory _scopeFactory;
        public FinancialProcess(IServiceScopeFactory scopeFactory) {
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

                    Func<DateTime, int> getFinYear = (endDate) =>
                    {
                        //финансовый год считаем завершенным до 15 января следующего года
                        return endDate.Month > 1 || endDate.Day > 15 ? endDate.Year : endDate.Year - 1;
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
                            var annual = context.FinanceAnnualSet.SingleOrDefault(f => f.Code == rep.Code && f.Year == rep.Year);

                            //удалить старый отчет
                            if (annual != null)
                            {
                                context.FinanceAnnualSet.Remove(annual);
                            }

                            context.FinanceAnnualSet.Add(rep);
                        }

                        raw.Status = FinanceProcessEnum.Processed;
                        context.SaveChanges();
                    }
                }
            }
        }
    }
}
