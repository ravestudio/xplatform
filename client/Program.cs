using CommonLib.ISS;
using System;
using System.Collections.Generic;
using System.Reactive.Disposables;
using System.Reactive.Linq;
using System.Threading.Tasks;

namespace client
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("- client");

            CommonLib.ISS.MicexISSClient _micexClient = new CommonLib.ISS.MicexISSClient(new CommonLib.WebApiClient());
            CommonLib.Services.MarketDataSource marketDataSource =
                new CommonLib.Services.MarketDataSource(new string[] { "LKOH", "GMKN", "NKNCP", "MOEX", "GAZP", "CHMF", "NLMK" }, _micexClient);

            var sub = marketDataSource.Subscribe(data =>
            {
                foreach (var marketData in data.MarketDataValues.Values)
                {
                    Console.WriteLine("Sec: {0}, Price: {1}", marketData.Code, marketData.LCURRENTPRICE);
                }

                Console.WriteLine("");
            });

            Task.Delay(20000).Wait();

            sub.Dispose();

            //IObservable<MarketData> obs = Observable.Interval(TimeSpan.FromSeconds(2))
            //        .Select(x => Observable.FromAsync(async () =>
            //        {
            //            var response = await _micexClient.GetSecurityInfo("LKOH");
            //            return response.MarketData[0];
            //        })).Concat().Sample(TimeSpan.FromSeconds(10));

            //obs.Subscribe(d =>
            //{
            //    Console.WriteLine("Security:{0}, price:{1}", d.Code, d.LCURRENTPRICE);
            //});

            //var sub1 = Observable.Interval(TimeSpan.FromSeconds(1))
            //        .Select(x => Observable.FromAsync(async () =>
            //        {
            //            var response = await _micexClient.GetSecurityInfo("LKOH");
            //            return response.MarketData[0];
            //        })).Concat();

            //var sub2 = Observable.Interval(TimeSpan.FromSeconds(5)).Select(t => new CommonLib.Services.MarketInfo());

            //sub2.CombineLatest(sub1, (i, m) => {

            //    if (i.data == null)
            //    {
            //        i.data = m;
            //    }
            //    else
            //    {
            //        //Console.WriteLine("data filled");
            //    }

            //    return i;
            //}).Sample(TimeSpan.FromSeconds(10))
            //.Subscribe(x =>
            //{
            //    Console.WriteLine(x.data.LCURRENTPRICE);
            //});

            Console.ReadKey();
        }
    }
}
