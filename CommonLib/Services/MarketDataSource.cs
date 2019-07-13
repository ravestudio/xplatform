using CommonLib.ISS;
using System;
using System.Collections.Generic;
using System.Reactive.Disposables;
using System.Reactive.Linq;
using System.Reactive.Subjects;
using System.Text;
using System.Threading.Tasks;

namespace CommonLib.Services
{
    public class MarketDataSource: IObservable<MarketInfo>
    {
        private IEnumerable<string> _codes = null;
        private MicexISSClient _micexClient = null;

        private IList<IObservable<MarketData>> _sourceList = null;
        private IList<IObservable<MarketData>> subjects = new List<IObservable<MarketData>>();
        private IList<IDisposable> _localSubscriptions = new List<IDisposable>();

        private IDictionary<string, MarketData> _defValues = new Dictionary<string, MarketData>();

        public MarketDataSource(IEnumerable<string> codes, MicexISSClient micexClient)
        {
            _codes = codes;
            _micexClient = micexClient;

            _sourceList = new List<IObservable<MarketData>>();

            foreach(string code in _codes)
            {
                IObservable<MarketData> _defObs = Observable.Return<MarketData>(new MarketData()
                {
                    Code = code,
                    LCURRENTPRICE = -100
                });

                IObservable<MarketData> obs = Observable.Interval(TimeSpan.FromSeconds(10))
                    .Select(x => Observable.FromAsync(async () =>
                {
                    var response = await _micexClient.GetSecurityInfo(code);
                    return response.MarketData[0];
                })).Concat();

                _sourceList.Add(_defObs.Concat(obs));
            }
        }

        public IDisposable Subscribe(IObserver<MarketInfo> observer)
        {
            IObservable<MarketInfo> result = Observable.Interval(TimeSpan.FromSeconds(1))
                .Select(x => new MarketInfo());

            foreach (var obs in _sourceList)
            {
                result = result.CombineLatest(obs, (i, d) => {
                    if (!i.MarketDataValues.ContainsKey(d.Code))
                    {
                        i.MarketDataValues.Add(d.Code, d);
                    }

                    return i;
                });
            }

            var _disp = result.Do(i =>
            {
                //Console.WriteLine("prepared");
            })
            .Sample(TimeSpan.FromSeconds(5))
            .Subscribe(observer);

            //var defer = Observable.Defer(() =>
            //{
            //    foreach (var obs in _sourceList)
            //    {
            //        _localSubscriptions.Add(obs.Subscribe(d => _defValues[d.Code] = d));
            //    }

            //    return result;
            //});

            //var _disp = defer.Subscribe(observer);

            return Disposable.Create(() =>
            {
                _disp.Dispose();

                //foreach (var subscript in _localSubscriptions)
                //{
                //    subscript.Dispose();
                //}
            });
        }
    }
}
