using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace CommonLib.Yahoo
{
    public class YahooClient
    {
        private WebApiClient _apiClient = null;
        public YahooClient(WebApiClient apiClient)
        {
            _apiClient = apiClient;
        }

        public async Task<string> GetFinancial(string Code)
        {
            string url = $"https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-financials?symbol={Code}";

            string response = await _apiClient.GetData(url);

            return response;
        }
    }
}
