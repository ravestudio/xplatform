using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace CommonLib.Tinkoff
{
    public class TinkoffClient
    {
        private WebApiClient _apiClient = null;

        public TinkoffClient(WebApiClient apiClient)
        {
            _apiClient = apiClient;
        }

        public async Task<String> GetCandles(string figi, string interval, DateTime from, DateTime to)
        {
            //"2020-05-20T07:00:00Z"

            string fromPr = from.ToString("yyyy-MM-ddTHH:mm:ssZ");
            string toPr = to.ToString("yyyy-MM-ddTHH:mm:ssZ");

            string url = $"https://api-invest.tinkoff.ru/openapi/sandbox/market/candles?figi={figi}&from={fromPr}&to={toPr}&interval={interval}";

            string response = "error";

            try
            {
                response = await _apiClient.GetData(url);
            }
            catch(Exception ex)
            {

            }

            return response;
        }
    }
}
