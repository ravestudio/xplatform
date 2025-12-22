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
using System.Threading;
using System.Threading.Tasks;

namespace PriceUpdater
{
    public class DividendHostedService : IHostedService, IDisposable
    {
        private IObservable<Quote> dividendSeq = null;
        private IDisposable dividendSubscription = null;

        private readonly IServiceScopeFactory _scopeFactory;
        private readonly RabbitSender _rabbitSender = null;
        private readonly UpdaterStorage _storage = null;
        public DividendHostedService(IServiceScopeFactory scopeFactory, RabbitSender rabbitSender, UpdaterStorage storage)
        {
            _scopeFactory = scopeFactory;
            _rabbitSender = rabbitSender;
            _storage = storage;
        }

        public void Dispose()
        {
            dividendSubscription.Dispose();
            dividendSubscription = null;
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            Action<string> activate = new Action<string>((arg) =>
            {
                if (arg == "dividendUpdater")
                {
                    dividendSubscription = dividendSeq.Subscribe(q =>
                    {
                        Log.Information($"update dividends {q.symbol}");
                    },
                    ex =>
                    {

                    });
                }
            });

            dividendSeq = Observable.Create<Quote>(observer =>
            {
                IList<Quote> quoteList;

                var securityISIN = _storage.GetSecurities().Where(s => new string[] { "stock" }.Contains(s.Type) && s.Region == "Moscow").Select(s => s.ISIN).ToList();

                quoteList = _storage.GetCurrentQuotes()
                    .Where(q => securityISIN.Contains(q.ISIN))
                    .OrderBy(q => q.symbol).ToList();

                foreach (Quote quote in quoteList)
                {
                    observer.OnNext(quote);
                }

                observer.OnCompleted();
                return Disposable.Empty;
            })
            .Select(q => Observable.Create<Quote>(observer => {

                _rabbitSender.PublishMessage<Quote>(q, "dividend.load");

                observer.OnNext(q);
                observer.OnCompleted();
                return Disposable.Empty;

            }).Delay(TimeSpan.FromSeconds(60)))
            .Concat()
            .Delay(TimeSpan.FromSeconds(60))
            .Repeat();

            activate("dividendUpdater");

            return Task.CompletedTask;
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            return Task.CompletedTask;
        }
    }
}
