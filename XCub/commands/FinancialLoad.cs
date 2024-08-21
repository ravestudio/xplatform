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
    public class FinancialLoad
    {
        private readonly IServiceScopeFactory _scopeFactory;
        public FinancialLoad(IServiceScopeFactory scopeFactory)
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

                        int max_timestamp = obj["incomeStatementHistory"]["incomeStatementHistory"].Select(s => (int)s["endDate"]["raw"]).Max();

                        System.DateTime dateTime = DateTime.SpecifyKind(new System.DateTime(1970, 1, 1, 0, 0, 0, 0), DateTimeKind.Utc);

                        YahooFinanceRaw raw = context.YahooFinanceRawSet.FirstOrDefault(y => y.Code == received.Code && y.Status == FinanceProcessEnum.Init);
                        raw.Data = received.Response;
                        raw.LoadDate = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc);
                        raw.Status = FinanceProcessEnum.Loaded;
                        raw.LastFinance = dateTime.AddSeconds(max_timestamp);
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
