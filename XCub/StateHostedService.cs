using CommonLib.Objects;
using Messaging.Messages;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Serilog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reactive.Disposables;
using System.Reactive.Linq;
using System.Text;
using System.Threading.Tasks;
using XCub.DataAccess;

namespace XCub
{
    public class StateHostedService : IHostedService, IDisposable
    {
        private IObservable<IList<Quote>> quoteSeq = null;
        private IDisposable quoteSubscription = null;

        private IObservable<IList<Security>> securitySeq = null;
        private IDisposable securitySubscription = null;

        private IObservable<IList<YahooFinancial>> yahooFinancialSeq = null;
        private IDisposable yahooFinancialSubscription = null;

        private readonly IServiceScopeFactory _scopeFactory;
        private readonly RabbitSender _rabbitSender = null;
        public StateHostedService(IServiceScopeFactory scopeFactory, RabbitSender rabbitSender)
        {
            _scopeFactory = scopeFactory;
            _rabbitSender = rabbitSender;
        }
        public Task StartAsync(CancellationToken cancellationToken)
        {

            securitySeq = Observable.Create<IList<Security>>(observer =>
            {
                IList<Security> securityList;
                using (var scope = _scopeFactory.CreateScope())
                {
                    var context = scope.ServiceProvider.GetRequiredService<XContext>();

                    securityList = context.SecuritySet.OrderBy(s => s.Code).ToList();

                }
                observer.OnNext(securityList);

                observer.OnCompleted();
                return Disposable.Empty;
            })
            .Delay(TimeSpan.FromSeconds(60))
            .Select(list => {

                _rabbitSender.PublishMessage<IList<Security>>(list, "state.security.update");

                return list;

            })
            .Repeat();

            yahooFinancialSeq = Observable.Create<IList<YahooFinancial>>(observer =>
            {
                IList<YahooFinancial> yahooFinancialsList;
                using (var scope = _scopeFactory.CreateScope())
                {
                    var context = scope.ServiceProvider.GetRequiredService<XContext>();

                    var first = from security in context.SecuritySet.Where(r => !string.IsNullOrEmpty(r.FinancialPage))

                                join finRaw in context.YahooFinanceRawSet on security.FinancialPage equals finRaw.Code into grouping
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

                    yahooFinancialsList = first.ToList().GroupBy(x => x.code)
                       .SelectMany(g =>
                           g.Select((j, i) => new YahooFinancial()
                           {
                               code = j.code,
                               name = j.name,
                               region = j.region,
                               loadDate = j.loadDate,
                               lastFinance = j.lastFinance,
                               status = j.status > 0 ? j.status.ToString() : null
                           })).ToList();
                       
                }

                observer.OnNext(yahooFinancialsList);
                observer.OnCompleted();
                return Disposable.Empty;
            })
            .Delay(TimeSpan.FromSeconds(20))
            .Select(list => {

                var filetred = list.Where(i => i.status != "Processed").ToList();
                _rabbitSender.PublishMessage<IList<YahooFinancial>>(filetred, "state.yahooFinancial.update");
                return list;
            })
            .Repeat();

            quoteSeq = Observable.Create<IList<Quote>>(observer =>
            {
                IList<Quote> quoteList;
                using (var scope = _scopeFactory.CreateScope())
                {
                    var context = scope.ServiceProvider.GetRequiredService<XContext>();

                    quoteList = context.QuoteSet.OrderBy(q => q.symbol).ToList();

                }
                observer.OnNext(quoteList);

                observer.OnCompleted();
                return Disposable.Empty;
            })
            .Delay(TimeSpan.FromSeconds(60))
            .Select(list => {

                _rabbitSender.PublishMessage<IList<Quote>>(list, "state.quote.update");

                return list;
            })
            .Repeat();

            quoteSubscription = quoteSeq.Subscribe(list =>
            {
                Log.Information($"update state");
            },
            ex =>
            {
                Log.Error(ex, "state update error");
            });

            securitySubscription = securitySeq.Subscribe(list =>
            {
                Log.Information($"update state");
            },
            ex =>
            {
                Log.Error(ex, "state update error");
            });

            yahooFinancialSubscription = yahooFinancialSeq.Subscribe(list =>
            {
                Log.Information("$update yahoo financial");
            },
            ex =>
            {
                Log.Error(ex, "state update error");
            });

            return Task.CompletedTask;
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            return Task.CompletedTask;
        }

        public void Dispose()
        {
            quoteSubscription.Dispose();
            quoteSubscription = null;

            securitySubscription.Dispose();
            securitySubscription = null;

            yahooFinancialSubscription.Dispose();
            yahooFinancialSubscription = null;
        }
    }
}
