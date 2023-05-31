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

namespace PriceUpdater
{

    class YahooFinancial
    {
        public string code { get; set; }
        public string name { get; set; }
        public DateTime? loadDate { get; set; }
        public DateTime? lastFinance { get; set; }

        public string status { get; set; }

    }
    public class FinanceHostedService : IHostedService, IDisposable
    {

        private IObservable<YahooFinancial> financeSeq = null;
        private IDisposable financeSubscription = null;


        private readonly ILogger _logger = null;
        public FinanceHostedService(ILogger logger)
        {
            _logger = logger;
        }
        public void Dispose()
        {
            //throw new NotImplementedException();
            financeSubscription.Dispose();
            financeSubscription = null;

        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            //string apiUrl = "http://dockerapi:80/api";
            //string apiUrl = "http://xplatform.net/api";
            string apiUrl = "http://localhost:5000/api";
            //string apiUrl = "http://localhost:9500/api";


            var xClient = new CommonLib.WebApiClient();


            IDictionary<string, string> newStatus = new Dictionary<string, string>();
            newStatus.Add("Init", "financial");
            newStatus.Add("Loaded", "process");

            financeSeq = Observable.FromAsync(async () =>
            {
                //throw new Exception();

                string financials = await xClient.GetData($"{apiUrl}/Yahoo");

                var y = JsonConvert.DeserializeObject<List<YahooFinancial>>(financials).Where(s =>
                !string.IsNullOrEmpty(s.status) &&
                !s.status.Equals("Processed") &&
                !(s.status.Equals("Init") && s.loadDate.HasValue)
                ).FirstOrDefault();

                return y;
            })
            .Where(y => y != null)
            .Select(async y =>
            {
                if (y != null)
                {
                    string content = JObject.FromObject(new
                    {
                        Type = newStatus[y.status],
                        Codes = new[] { y.code }
                    }).ToString();
                    HttpContent stringContent = new StringContent(content, Encoding.UTF8, "application/json");
                    await xClient.PostDataAsync($"{apiUrl}/Yahoo", stringContent);
                }

                return y;
            })
            .Delay(TimeSpan.FromSeconds(60))
            .Concat()
            .Repeat();

            financeSubscription = financeSeq.Subscribe(q =>
                    {
                        _logger.Information($"update finance {q.code}");
                    }, ex =>
                     {
                         _logger.Error(ex, "update finance error");

                     }, () =>
                     {
                         _logger.Information("complete");

                     });

            return Task.CompletedTask;
        }


        public Task StopAsync(CancellationToken cancellationToken)
        {
            return Task.CompletedTask;
        }
    }
}
