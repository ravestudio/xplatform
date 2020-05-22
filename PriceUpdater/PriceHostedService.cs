using Microsoft.Extensions.Hosting;
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

        private IObservable<Quote> quoteSeq = null;
        private IDisposable subscription = null;

        private System.Reactive.Subjects.Subject<string> restartStream = new System.Reactive.Subjects.Subject<string>();
        public void Dispose()
        {
            //throw new NotImplementedException();
            subscription.Dispose();
            subscription = null;
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            string apiUrl = "http://dockerapi:80/api";
            //string apiUrl = "http://xplatform.net/api";

            var apiClient = new CommonLib.WebApiClient();
            apiClient.addHeader("Authorization", "Bearer t.FwRjwQy5LHo3uXE0iQ6D4VGVFRvccr1_PItEHgLIOt4sc7QkQkBzd_eDACB0TTfnBBOWi_mtg84cPbvKwD4gpQ");

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

            

            Action activate = new Action(() =>
            {
                subscription = quoteSeq.Subscribe(q =>
                {

                    //Console.WriteLine($"{q.symbol}: {q.price}");
                },
                ex =>
                {
                    restartStream.OnNext("priceUpdater");
                });
            });
            

            CommonLib.Tinkoff.TinkoffClient _tinkoffClient = new CommonLib.Tinkoff.TinkoffClient(apiClient);

            quoteSeq = Observable.Create<Quote>(async observer => {

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

            restartStream
                .Delay(TimeSpan.FromMinutes(10))
                .Subscribe(proc =>
            {

                subscription.Dispose();
                subscription = null;

                activate();
            });

            activate();

            return Task.CompletedTask;
        }


        public Task StopAsync(CancellationToken cancellationToken)
        {
            return Task.CompletedTask;
        }
    }
}
