using CommonLib.Objects;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Newtonsoft.Json;
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
    public class PriceHostedService : IHostedService, IDisposable
    {
        private IObservable<Quote> usaQuoteSeq = null;
        private IDisposable usaSubscription = null;

        private IObservable<Quote> chinaQuoteSeq = null;
        private IDisposable chinaSubscription = null;

        private IObservable<MarketData> moscowQuoteSeq = null;
        private IDisposable moscowSubscription = null;

        private readonly IServiceScopeFactory _scopeFactory;
        private readonly RabbitSender _rabbitSender = null;
        private readonly UpdaterStorage _storage = null;
        public PriceHostedService(IServiceScopeFactory scopeFactory, RabbitSender rabbitSender, UpdaterStorage storage)
        {
            _scopeFactory = scopeFactory;
            _rabbitSender = rabbitSender;
            _storage = storage;
        }

        public void Dispose()
        {
            usaSubscription.Dispose();
            usaSubscription = null;

            chinaSubscription.Dispose();
            chinaSubscription = null;

            moscowSubscription.Dispose();
            moscowSubscription = null;
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            Action<string> activate = new Action<string>((arg) =>
            {
                if (arg == "usaPriceUpdater")
                {
                    usaSubscription = usaQuoteSeq.Subscribe(q =>
                    {
                        Log.Information($"update price {q.symbol}");
                    },
                    ex =>
                    {

                    });
                }

                if (arg == "chinaPriceUpdater")
                {
                    chinaSubscription = chinaQuoteSeq.Subscribe(q =>
                    {
                        Log.Information($"update price {q.symbol}");
                    },
                    ex =>
                    {
                    });
                }

                if (arg == "moscowPriceUpdater")
                {
                    moscowSubscription = moscowQuoteSeq.Subscribe(md =>
                    {
                        Log.Information($"update price {md.ticker}");
                    },
                    ex =>
                    {

                    });
                }


            });

            chinaQuoteSeq = Observable.Create<Quote>(observer =>
            {
                IList<Quote> quoteList;

                var securityCodes = _storage.GetSecurities().Where(s => new string[] { "stock", "etf" }.Contains(s.Type) && s.Region == "China").Select(s => s.Code).ToList();

                quoteList = _storage.GetCurrentQuotes()
                    .Where(q => securityCodes.Contains(q.symbol))
                    .OrderBy(q => q.symbol).ToList();

                foreach (Quote quote in quoteList)
                {
                    observer.OnNext(quote);
                }

                observer.OnCompleted();
                return Disposable.Empty;
            })
            .Select(q => Observable.Create<Quote>(observer => {

                _rabbitSender.PublishMessage<Quote>(q, "quote.china.load");

                observer.OnNext(q);
                observer.OnCompleted();
                return Disposable.Empty;

            }).Delay(TimeSpan.FromSeconds(5)))
            .Concat()
            .Delay(TimeSpan.FromSeconds(5))
            .Repeat();

            usaQuoteSeq = Observable.Create<Quote>(async observer =>
            {
                IList<Quote> quoteList;
                
                var securityCodes = _storage.GetSecurities().Where(s => new string[] { "stock", "etf" }.Contains(s.Type) && s.Region == "United States").Select(s => s.Code);

                quoteList = _storage.GetCurrentQuotes()
                    .Where(q => securityCodes.Contains(q.symbol))
                    .OrderBy(q => q.symbol).ToList();

                foreach (Quote quote in quoteList)
                {
                    observer.OnNext(quote);
                }

                observer.OnCompleted();
                return Disposable.Empty;

            })
            .Select(q => Observable.Create<Quote>(observer => {

                _rabbitSender.PublishMessage<Quote>(q, "quote.usa.load");

                observer.OnNext(q);
                observer.OnCompleted();
                return Disposable.Empty;

            }).Delay(TimeSpan.FromSeconds(5)))
            .Concat()
            .Delay(TimeSpan.FromSeconds(5))
            .Repeat();

            moscowQuoteSeq = Observable.Create<MarketData>(async observer =>
            {
                IList<Quote> quoteList;
                IList<Security> securityObj;

                securityObj = _storage.GetSecurities().Where(s => s.Region == "Moscow").ToList();

                var securityCodes = securityObj.Select(s => s.Code);

                quoteList = _storage.GetCurrentQuotes().Where(q => securityCodes.Contains(q.symbol))
                    .OrderBy(q => q.symbol).ToList();

                Func<string, string> getMarket = (type) =>
                {
                    if (type == "bond") return "bonds";

                    if (type == "currency") return "selt";

                    return "shares";
                };

                foreach (Quote quote in quoteList)
                {
                    MarketData md = null;

                    md = new MarketData()
                    {
                        quote = quote,
                        board = quote.Board,
                        market = getMarket(securityObj.First(s => s.Code == quote.symbol).Type),
                        ticker = quote.symbol
                    };

                    observer.OnNext(md);
                }

                observer.OnCompleted();
                return Disposable.Empty;
            }).Select(md => Observable.Create<MarketData>(observer => {

                _rabbitSender.PublishMessage<MarketData>(md, "quote.moscow.load");

                observer.OnNext(md);
                observer.OnCompleted();
                return Disposable.Empty;
            }).Delay(TimeSpan.FromSeconds(5)))
            .Concat()
            .Delay(TimeSpan.FromSeconds(5))
            .Repeat();

            activate("chinaPriceUpdater");
            activate("usaPriceUpdater");
            activate("moscowPriceUpdater");

            return Task.CompletedTask;
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            return Task.CompletedTask;
        }

    }
}
