using CommonLib.Objects;
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
        }
    }
}
