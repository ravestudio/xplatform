﻿using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Globalization;
using System.Linq;
using System.Net.Http;
using System.Reactive.Disposables;
using System.Reactive.Linq;
using CommonLib.Objects;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using CommonLib.ISS;

namespace PriceUpdater
{
    public class PriceHostedService : IHostedService, IDisposable
    {

        private IObservable<Quote> usaQuoteSeq = null;
        private IDisposable usaSubscription = null;

        private IObservable<Quote> moscowQuoteSeq = null;
        private IDisposable moscowSubscription = null;

        private System.Reactive.Subjects.Subject<string> restartStream = new System.Reactive.Subjects.Subject<string>();
        public void Dispose()
        {
            //throw new NotImplementedException();
            usaSubscription.Dispose();
            usaSubscription = null;

            moscowSubscription.Dispose();
            moscowSubscription = null;
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            string apiUrl = "http://dockerapi:80/api";
            //string apiUrl = "http://xplatform.net/api";
            //string apiUrl = "http://localhost:5000/api";

            var apiClient = new CommonLib.WebApiClient();
            apiClient.addHeader("Authorization", "Bearer t.FwRjwQy5LHo3uXE0iQ6D4VGVFRvccr1_PItEHgLIOt4sc7QkQkBzd_eDACB0TTfnBBOWi_mtg84cPbvKwD4gpQ");
            CommonLib.Tinkoff.TinkoffClient _tinkoffClient = new CommonLib.Tinkoff.TinkoffClient(apiClient);

            MicexISSClient micexClient = new MicexISSClient(new CommonLib.WebApiClient());

            var xClient = new CommonLib.WebApiClient();

            Func<string, Quote> GetQuoteFromCandles = new Func<string, Quote>(data => {

                JObject obj = JObject.Parse(data);

                JToken[] candles = null;

                candles = obj["payload"]["candles"]
                .OrderByDescending(t => (DateTime)t["time"])
                .Take(2).ToArray();

                return new Quote()
                {
                    figi = (string)candles[0]["figi"],
                    open = decimal.Parse((string)candles[0]["o"], CultureInfo.InvariantCulture),
                    price = decimal.Parse((string)candles[0]["c"], CultureInfo.InvariantCulture),
                    previousClose = decimal.Parse((string)candles[1]["c"], CultureInfo.InvariantCulture)
                };

            });

            

            Action<string> activate = new Action<string>((aprg) =>
            {
                if (aprg == "usaPriceUpdater")
                {
                    usaSubscription = usaQuoteSeq.Subscribe(q =>
                    {

                    },
                    ex =>
                    {
                        restartStream.OnNext("usaPriceUpdater");
                    });
                }

                if (aprg == "moscowPriceUpdater")
                {
                    moscowSubscription = moscowQuoteSeq.Subscribe(q =>
                    {

                    },
                    ex =>
                    {
                        restartStream.OnNext("moscowPriceUpdater");
                    });
                }
            });
            

            

            usaQuoteSeq = Observable.Create<Quote>(async observer => {

                string securities = await xClient.GetData($"{apiUrl}/security");
                string currentQuotes = await xClient.GetData($"{apiUrl}/Quote");

                var securityCodes = JsonConvert.DeserializeObject<List<Security>>(securities).Where(s => s.Market == "shares" && s.Region == "United States").Select(s => s.Code);

                var quoteList = JsonConvert.DeserializeObject<List<Quote>>(currentQuotes)
                .Where(q => securityCodes.Contains(q.symbol))
                .OrderBy(q => q.symbol);

                foreach (Quote quote in quoteList)
                {
                    observer.OnNext(quote);
                }

                observer.OnCompleted();
                return Disposable.Empty;

            })
            .Select(q => Observable.FromAsync(async () =>
            {
                //throw new Exception();
                string candles = await _tinkoffClient.GetCandles(q.figi, "day", DateTime.UtcNow.AddDays(-3), DateTime.UtcNow);

                Quote result = GetQuoteFromCandles(candles);
                result.symbol = q.symbol;

                //post quote to server
                string content = JObject.FromObject(result).ToString();
                HttpContent stringContent = new StringContent(content, Encoding.UTF8, "application/json");
                await xClient.PostDataAsync($"{apiUrl}/Quote", stringContent);

                return result;
            }).Delay(TimeSpan.FromSeconds(20)))
            .Concat()
            .Repeat();

            moscowQuoteSeq = Observable.Create<Quote>(async observer =>
            {
                string securities = await xClient.GetData($"{apiUrl}/security");
                string currentQuotes = await xClient.GetData($"{apiUrl}/Quote");

                var securityCodes = JsonConvert.DeserializeObject<List<Security>>(securities).Where(s => s.Market == "shares" && s.Region == "Moscow").Select(s => s.Code);
                var quoteList = JsonConvert.DeserializeObject<List<Quote>>(currentQuotes)
                .Where(q => securityCodes.Contains(q.symbol))
                .OrderBy(q => q.symbol);

                foreach (Quote quote in quoteList)
                {
                    observer.OnNext(quote);
                }

                observer.OnCompleted();
                return Disposable.Empty;
            }).Select(q => Observable.FromAsync(async () =>
            {

                ISSResponse issResp = await micexClient.GetSecurityInfo("shares", "TQBR", q.symbol);

                var result = new Quote()
                {
                    symbol = q.symbol,
                    figi = q.figi,
                    open = issResp.MarketData.First().OPEN,
                    price = issResp.MarketData.First().LAST,
                    previousClose = issResp.SecurityInfo.First().PREVLEGALCLOSEPRICE
                };

                //post quote to server
                string content = JObject.FromObject(result).ToString();
                HttpContent stringContent = new StringContent(content, Encoding.UTF8, "application/json");
                await xClient.PostDataAsync($"{apiUrl}/Quote", stringContent);

                return result;
            }).Delay(TimeSpan.FromSeconds(20)))
            .Concat()
            .Repeat();

            restartStream
                .Delay(TimeSpan.FromMinutes(10))
                .Subscribe(proc =>
            {

                if (proc == "usaPriceUpdater")
                {
                    usaSubscription.Dispose();
                    usaSubscription = null;
                }

                if (proc == "moscowPriceUpdater")
                {
                    moscowSubscription.Dispose();
                    moscowSubscription = null;
                }

                activate(proc);
            });

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
