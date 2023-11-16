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
using Messaging.Messages;
using System.Reactive;

namespace PriceUpdater
{

    public class FinanceHostedService : IHostedService, IDisposable
    {

        private IObservable<YahooFinancial?> financeSeq = null;
        private IDisposable financeSubscription = null;


        private readonly ILogger _logger = null;
        private readonly RabbitSender _rabbitSender = null;
        private readonly UpdaterStorage _storage = null;
        public FinanceHostedService(ILogger logger, RabbitSender rabbitSender, UpdaterStorage storage)
        {
            _logger = logger;
            _rabbitSender = rabbitSender;
            _storage = storage;
        }
        public void Dispose()
        {
            //throw new NotImplementedException();
            financeSubscription.Dispose();
            financeSubscription = null;

        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            string apiUrl = "http://dockerapi:80/api";
            //string apiUrl = "http://xplatform.net/api";
            //string apiUrl = "http://localhost:5000/api";
            //string apiUrl = "http://localhost:9500/api";


            var xClient = new CommonLib.WebApiClient();


            IDictionary<string, string> newStatus = new Dictionary<string, string>();
            newStatus.Add("Init", "financial");
            newStatus.Add("Loaded", "process");

            financeSeq = Observable.Create<YahooFinancial>(observer =>
            {
                //IList<YahooFinancial> financials = _storage.GetYahooFinancials();

                var y = _storage.GetYahooFinancialRequest();

                observer.OnNext(y);
                observer.OnCompleted();
                return Disposable.Empty;
            }).Where(y => y != null)
            .Select(y =>
            {
                if (y != null)
                {
                    Yahoo msg = new Yahoo()
                    {
                        Codes = new[] { y.code }
                    };

                    _rabbitSender.PublishMessage<Yahoo>(msg, string.Format("yahoo.{0}", newStatus[y.status]));

                    _storage.UpdateFinancialStatus(y.code, "Processed");
                }

                return y;
            })
            .Delay(TimeSpan.FromSeconds(60))
            //.Concat()
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
