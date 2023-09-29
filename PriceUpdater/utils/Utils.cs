
using CommonLib.ISS;
using CommonLib.Objects;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using Tinkoff.InvestApi.V1;

//public Action<int> print = i => Console.WriteLine(i);

//Action<int> DisplayLatitude = i => Console.WriteLine($"Lat: {i}");

namespace PriceUpdater {

    public static class Utils
    {

        public static DateTime UnixTimeToDateTime(long unixtime)
        {
            System.DateTime dtDateTime = new DateTime(1970, 1, 1, 0, 0, 0, 0, System.DateTimeKind.Utc);
            dtDateTime = dtDateTime.AddSeconds(unixtime);
            return dtDateTime;
        }
        public static string CandlesToJson(IList<HistoricCandle> historic)
        {
            var candles = historic.Select(c => new { o = (decimal)c.Open, c = (decimal)c.Close, time = UnixTimeToDateTime(c.Time.Seconds) }).ToList();

            return JsonConvert.SerializeObject(new { payload = new { candles = candles } });
        }

        public static Func<ISSResponse, Quote> GetQuoteFromISSResponse = issResp =>
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
        };

        public static Func<string, Quote> GetQuoteFromCandles = data =>
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
        };

    }
}