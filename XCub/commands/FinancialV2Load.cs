using CommonLib.Objects;
using Messaging.Messages;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using XCub.DataAccess;
using System.Text;
using System.Text.Json;
using Newtonsoft.Json.Linq;

namespace XCub.commands
{
    public class FinancialV2Load
    {
        private readonly IServiceScopeFactory _scopeFactory;
        public FinancialV2Load(IServiceScopeFactory scopeFactory)
        {
            this._scopeFactory = scopeFactory;
        }
        public void Exec(string message)
        {
            var received = JsonSerializer.Deserialize<YahooReceived>(message);

            if (received != null)
            {
                using (var scope = _scopeFactory.CreateScope())
                {
                    var context = scope.ServiceProvider.GetRequiredService<XContext>();

                    try
                    {
                        JObject obj = JObject.Parse(received.Response);

                        IList<string> endDates = new List<string>();

                        var incomeSet = obj["income"];

                        foreach (JObject token in incomeSet)
                        {
                            foreach (JProperty prop in token.Properties())
                            {
                                if (prop.Name != "index")
                                {
                                    string endDate = prop.Name;

                                    if (!endDates.Any(i => i == endDate))
                                    {
                                        endDates.Add(endDate);
                                    }
                                }
                            }
                        }

                        DateTime max_endDate = endDates.Select(d => DateTime.SpecifyKind(DateTime.Parse(d), DateTimeKind.Utc)).Max();                        

                        YahooFinanceRaw raw = context.YahooFinanceRawSet.FirstOrDefault(y => y.Code == received.Code && y.Status == FinanceProcessEnum.Init);
                        raw.Data = received.Response;
                        raw.LoadDate = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc);
                        raw.Status = FinanceProcessEnum.Loaded;
                        raw.LastFinance = max_endDate;
                    }
                    catch (Exception ex)
                    {
                        YahooFinanceRaw raw = context.YahooFinanceRawSet.FirstOrDefault(y => y.Code == received.Code && y.Status == FinanceProcessEnum.Init);
                        raw.LoadDate = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc);

                    }

                    context.SaveChanges();
                }
            }
        }
    }
}
