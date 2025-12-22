using CommonLib.Objects;
using Messaging.Messages;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using XCub.DataAccess;

namespace XCub.commands
{
    public class DividendUpdate
    {
        private readonly IServiceScopeFactory _scopeFactory;
        public DividendUpdate(IServiceScopeFactory scopeFactory)
        {
            this._scopeFactory = scopeFactory;
        }

        public void Exec(string message)
        {
            var received = JsonSerializer.Deserialize<Dividends>(message);

            if (received != null)
            {
                using (var scope = _scopeFactory.CreateScope())
                {
                    var context = scope.ServiceProvider.GetRequiredService<XContext>();

                    var security = context.SecuritySet.SingleOrDefault(q => q.ISIN == received.ISIN);

                    if (security != null)
                    {
                        var prev = context.DividendSet.Where(div => div.securityId == security.Id).ToList();

                        foreach(var div in received.dividends)
                        {
                            if (prev.Count(d => d.declaredDate == div.declaredDate) == 0)
                            {
                                div.securityId = security.Id;
                                context.DividendSet.Add(div);
                            }
                        }
                        context.SaveChanges();
                    }
                }
            }
        }
    }
}
