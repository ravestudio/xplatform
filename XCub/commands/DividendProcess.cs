using CommonLib.Model;
using CommonLib.Objects;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using XCub.DataAccess;

namespace XCub.commands
{
    public class DividendProcess
    {
        private readonly IServiceScopeFactory _scopeFactory;
        public DividendProcess(IServiceScopeFactory scopeFactory)
        {
            this._scopeFactory = scopeFactory;
        }

        public void Exec()
        {
            using (var scope = _scopeFactory.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<XContext>();

                var dividends = context.DividendSet.Include(d => d.Security).Where(d => d.Security.Code == "MTSS" && d.processed == false ).ToList();

                foreach (var dividend in dividends)
                {

                    if (DateTime.SpecifyKind(dividend.paymentDate, DateTimeKind.Utc) > DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc))
                    {
                        continue;
                    }

                    var stockCount = 0;

                    var snap = context.SnapshootSet
                    .Where(snap => DateTime.SpecifyKind(snap.ChangeDate, DateTimeKind.Utc) <= DateTime.SpecifyKind(dividend.lastBuyDate, DateTimeKind.Utc))
                    .OrderByDescending(s => s.ChangeDate)
                    .FirstOrDefault();

                    PortfolioSnapshoot portfolioSnapshoot = new PortfolioSnapshoot();
                    portfolioSnapshoot.read(snap.Data);

                    foreach(var account in portfolioSnapshoot.Accounts)
                    {
                        var positionList = account.Value.PositionItems[dividend.Security.ISIN].ToList();
                        if (positionList != null) {
                           stockCount += positionList.Sum(p => p.Limit);
                        }
                    }

                    var income = new Income()
                    {
                        incomeType = "DividendIncome",
                        sourse = dividend.Security.Code,
                        paymentDate = DateTime.SpecifyKind(dividend.paymentDate, DateTimeKind.Unspecified),
                        volume = dividend.dividendNet * stockCount,
                        taxes = dividend.dividendNet * stockCount*0.13m
                    };

                    context.IncomeSet.Add(income);

                    dividend.processed = true;

                    context.SaveChanges();
                }
                

            }
        }
    }
}
