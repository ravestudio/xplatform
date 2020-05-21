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

namespace PriceUpdater
{
    public class PriceHostedService : IHostedService, IDisposable
    {
        public void Dispose()
        {
            //throw new NotImplementedException();
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            //string apiUrl = "http://dockerapi:80/api";
            string apiUrl = "http://xplatform.net/api";

            var apiClient = new CommonLib.WebApiClient();
            apiClient.addHeader("Authorization", "Bearer t.FwRjwQy5LHo3uXE0iQ6D4VGVFRvccr1_PItEHgLIOt4sc7QkQkBzd_eDACB0TTfnBBOWi_mtg84cPbvKwD4gpQ");

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

            var xClient = new CommonLib.WebApiClient();

            CommonLib.Tinkoff.TinkoffClient _tinkoffClient = new CommonLib.Tinkoff.TinkoffClient(apiClient);

            Observable.Create<Quote>(async observer => {

                string currentQuotes = await xClient.GetData($"{apiUrl}/Quote");

                var quoteList = JsonConvert.DeserializeObject<List<Quote>>(currentQuotes).OrderBy(q => q.symbol);

                foreach (Quote quote in quoteList)
                {
                    observer.OnNext(quote);
                }

                observer.OnCompleted();
                return Disposable.Empty;

            })
            .Select(q => Observable.FromAsync(async () =>
            {
                string candles = await _tinkoffClient.GetCandles(q.figi, "day", DateTime.UtcNow.AddDays(-3), DateTime.UtcNow);

                Quote result = GetQuoteFromCandles(candles);
                result.symbol = q.symbol;

                return result;
            }).Delay(TimeSpan.FromSeconds(20)))
            .Concat()
            .Repeat()
            .Subscribe(async q =>
            {
                string content = JObject.FromObject(q).ToString();
                HttpContent stringContent = new StringContent(content, Encoding.UTF8, "application/json");

                string result = await xClient.PostDataAsync($"{apiUrl}/Quote", stringContent);

                Console.WriteLine($"{q.symbol}: {q.price}");
            });

            return Task.CompletedTask;
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            return Task.CompletedTask;
        }
    }
}
