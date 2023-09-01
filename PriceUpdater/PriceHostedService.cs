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
using CommonLib.ISS;
using Serilog;
using Tinkoff.InvestApi;
using Google.Protobuf.WellKnownTypes;
using Tinkoff.InvestApi.V1;
using System.Reflection.Metadata;

namespace PriceUpdater
{
    public class PriceHostedService : IHostedService, IDisposable
    {

        private IObservable<Quote> usaQuoteSeq = null;
        private IDisposable usaSubscription = null;

        private IObservable<Quote> chinaQuoteSeq = null;
        private IDisposable chinaSubscription = null;

        private IObservable<Quote> moscowQuoteSeq = null;
        private IDisposable moscowSubscription = null;

        private System.Reactive.Subjects.Subject<string> restartStream = new System.Reactive.Subjects.Subject<string>();

        private readonly ILogger _logger = null;
        public PriceHostedService(ILogger logger)
        {
            _logger = logger;
        }
        public void Dispose()
        {
            //throw new NotImplementedException();
            usaSubscription.Dispose();
            usaSubscription = null;

            chinaSubscription.Dispose();
            chinaSubscription = null;

            moscowSubscription.Dispose();
            moscowSubscription = null;
        }

        public DateTime UnixTimeToDateTime(long unixtime)
        {
            System.DateTime dtDateTime = new DateTime(1970, 1, 1, 0, 0, 0, 0, System.DateTimeKind.Utc);
            dtDateTime = dtDateTime.AddSeconds(unixtime);
            return dtDateTime;
        }

        private string CandlesToJson(IList<HistoricCandle> historic)
        {
            var candles = historic.Select(c => new { o = (decimal)c.Open, c = (decimal)c.Close, time = UnixTimeToDateTime(c.Time.Seconds) }).ToList();

            return JsonConvert.SerializeObject(new { payload = new { candles = candles } });
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            //string apiUrl = "http://dockerapi:80/api";
            //string apiUrl = "http://xplatform.net/api";
            //string apiUrl = "http://localhost:5000/api";
            string apiUrl = "http://192.168.0.17/api";

            var client = InvestApiClientFactory.Create("t.hAFDFeeTzLR_tlTz9H7S406ecutXFe21HljCDGf7sm_DRIYTDesfGlkS5P5ohNcZ_0tZUwHKgdhvMXhoRO0iYw");

            var apiClient = new CommonLib.WebApiClient();
            apiClient.addHeader("Authorization", "Bearer t.hAFDFeeTzLR_tlTz9H7S406ecutXFe21HljCDGf7sm_DRIYTDesfGlkS5P5ohNcZ_0tZUwHKgdhvMXhoRO0iYw");
            CommonLib.Tinkoff.TinkoffClient _tinkoffClient = new CommonLib.Tinkoff.TinkoffClient(apiClient);

            MicexISSClient micexClient = new MicexISSClient(new CommonLib.WebApiClient());

            var xClient = new CommonLib.WebApiClient();

            Func<string, Quote> GetQuoteFromCandles = new Func<string, Quote>(data =>
            {

                JObject obj = JObject.Parse(data);

                JToken[] candles = null;

                if (obj["payload"]["candles"].Count() < 2)
                {
                    return null;
                }

                candles = obj["payload"]["candles"]
                .OrderByDescending(t => (DateTime)t["time"])
                .Take(2).ToArray();


                return new Quote()
                {
                    open = decimal.Parse((string)candles[0]["o"], CultureInfo.InvariantCulture),
                    price = decimal.Parse((string)candles[0]["c"], CultureInfo.InvariantCulture),
                    previousClose = decimal.Parse((string)candles[1]["c"], CultureInfo.InvariantCulture)
                };

            });

            Func<ISSResponse, Quote> GetQuoteFromISSResponse = new Func<ISSResponse, Quote>(issResp =>
            {
                if (issResp.MarketData.Count > 0 && issResp.SecurityInfo.Count > 0)
                {
                    return new Quote()
                    {

                        open = issResp.MarketData.First().OPEN,
                        price = issResp.MarketData.First().LAST,
                        NKD = issResp.SecurityInfo.First().NKD,
                        previousClose = issResp.SecurityInfo.First().PREVPRICE,

                    };
                }

                return null;
            });



            Action<string> activate = new Action<string>((arg) =>
            {
                _logger.Information($"Activation: {arg}");

                if (arg == "usaPriceUpdater")
                {
                    usaSubscription = usaQuoteSeq.Subscribe(q =>
                    {
                        Log.Information($"update price {q.symbol}");
                    },
                    ex =>
                    {
                        _logger.Error(ex, "usaPriceUpdater error");
                        restartStream.OnNext("usaPriceUpdater");
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
                        _logger.Error(ex, "chinaPriceUpdater error");
                        restartStream.OnNext("chinaPriceUpdater");
                    });
                }

                if (arg == "moscowPriceUpdater")
                {
                    moscowSubscription = moscowQuoteSeq.Subscribe(q =>
                    {
                        Log.Information($"update price {q.symbol}");
                    },
                    ex =>
                    {
                        _logger.Error(ex, "moscowPriceUpdater error");
                        restartStream.OnNext("moscowPriceUpdater");
                    });
                }
            });


            chinaQuoteSeq = Observable.Create<Quote>(async observer =>
            {

                string securities = await xClient.GetData($"{apiUrl}/security");
                string currentQuotes = await xClient.GetData($"{apiUrl}/Quote");

                var securityCodes = JsonConvert.DeserializeObject<List<Security>>(securities).Where(s => new string[]{ "stock", "etf"}.Contains(s.Type) && s.Region == "China").Select(s => s.Code);

                var quoteList = JsonConvert.DeserializeObject<List<Quote>>(currentQuotes)
                .Where(q => securityCodes.Contains(q.symbol))
                .OrderBy(q => q.symbol);
                //.OrderBy(q => q.lastUpdate);

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
                //string candles = await _tinkoffClient.GetCandles(q.figi, "day", DateTime.UtcNow.AddDays(-20), DateTime.UtcNow);

                //Quote result = GetQuoteFromCandles(candles);

                var request = new GetCandlesRequest { Figi = q.figi, From = DateTime.UtcNow.AddDays(-20).ToTimestamp(), To = DateTime.UtcNow.ToTimestamp(), Interval = CandleInterval.Day };

                var resp = client.MarketData.GetCandles(request);
                var candles = CandlesToJson(resp.Candles);

                Quote result = GetQuoteFromCandles(candles);

                if (result != null)
                {
                    result.Id = q.Id;
                    result.symbol = q.symbol;
                    result.Board = q.Board;
                    result.figi = q.figi;

                    //post quote to server
                    string content = JObject.FromObject(result).ToString();
                    HttpContent stringContent = new StringContent(content, Encoding.UTF8, "application/json");
                    await xClient.PostDataAsync($"{apiUrl}/Quote", stringContent);
                }

                if (result == null)
                {
                    result = new Quote()
                    {
                        symbol = q.symbol
                    };
                }

                return result;
            }).Delay(TimeSpan.FromSeconds(5)))
            .Concat()
            .Repeat();


            usaQuoteSeq = Observable.Create<Quote>(async observer =>
            {

                string securities = await xClient.GetData($"{apiUrl}/security");
                string currentQuotes = await xClient.GetData($"{apiUrl}/Quote");

                var securityCodes = JsonConvert.DeserializeObject<List<Security>>(securities).Where(s => new string[] { "stock", "etf" }.Contains(s.Type) && s.Region == "United States").Select(s => s.Code);

                var quoteList = JsonConvert.DeserializeObject<List<Quote>>(currentQuotes)
                .Where(q => securityCodes.Contains(q.symbol))
                .OrderBy(q => q.symbol);
                //.OrderBy(q => q.lastUpdate);

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
                //string candles = await _tinkoffClient.GetCandles(q.figi, "day", DateTime.UtcNow.AddDays(-20), DateTime.UtcNow);

                var request = new GetCandlesRequest { Figi = q.figi, From = DateTime.UtcNow.AddDays(-20).ToTimestamp(), To = DateTime.UtcNow.ToTimestamp(), Interval = CandleInterval.Day };
                var resp = client.MarketData.GetCandles(request);
                var candles = CandlesToJson(resp.Candles);

                Quote result = GetQuoteFromCandles(candles);

                if (result != null)
                {
                    result.Id = q.Id;
                    result.figi = q.figi;
                    result.symbol = q.symbol;
                    result.Board = q.Board;

                    //post quote to server
                    string content = JObject.FromObject(result).ToString();
                    HttpContent stringContent = new StringContent(content, Encoding.UTF8, "application/json");
                    await xClient.PostDataAsync($"{apiUrl}/Quote", stringContent);
                }

                if (result == null)
                {
                    result = new Quote()
                    {
                        symbol = q.symbol
                    };
                }

                return result;
            }).Delay(TimeSpan.FromSeconds(5)))
            .Concat()
            .Repeat();

            moscowQuoteSeq = Observable.Create<MarketData>(async observer =>
            {
                string securities = await xClient.GetData($"{apiUrl}/security");
                string currentQuotes = await xClient.GetData($"{apiUrl}/Quote");

                var securityObj = JsonConvert.DeserializeObject<List<Security>>(securities).Where(s => s.Region == "Moscow");

                var securityCodes = securityObj.Select(s => s.Code);
                var quoteList = JsonConvert.DeserializeObject<List<Quote>>(currentQuotes)
                .Where(q => securityCodes.Contains(q.symbol))
                //.OrderBy(q => q.symbol);
                .OrderBy(q => q.lastUpdate);

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
            }).Select(md => Observable.FromAsync(async () =>
            {

                ISSResponse issResp = await micexClient.GetSecurityInfo(md.market, md.board, md.ticker);


                Quote result = GetQuoteFromISSResponse(issResp);

                if (result != null)
                {
                    result.Id = md.quote.Id;
                    result.figi = md.quote.figi;
                    result.symbol = md.quote.symbol;
                    result.Board = md.quote.Board;

                    //post quote to server
                    string content = JObject.FromObject(result).ToString();
                    HttpContent stringContent = new StringContent(content, Encoding.UTF8, "application/json");
                    await xClient.PostDataAsync($"{apiUrl}/Quote", stringContent);
                }

                if (result == null)
                {
                    result = new Quote()
                    {
                        symbol = md.quote.symbol
                    };
                }

                return result;
            }).Delay(TimeSpan.FromSeconds(10)))
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

                    if (proc == "chinaPriceUpdater")
                    {
                        chinaSubscription.Dispose();
                        chinaSubscription = null;
                    }

                    if (proc == "moscowPriceUpdater")
                    {
                        moscowSubscription.Dispose();
                        moscowSubscription = null;
                    }

                    activate(proc);
                });

            activate("usaPriceUpdater");
            activate("chinaPriceUpdater");
            activate("moscowPriceUpdater");

            return Task.CompletedTask;
        }


        public Task StopAsync(CancellationToken cancellationToken)
        {
            return Task.CompletedTask;
        }
    }
}
