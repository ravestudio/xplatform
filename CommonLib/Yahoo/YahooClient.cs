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
            //private
            //string url = $"https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-financials?symbol={Code}";

            //asset-profile
            string url = $"https://mboum-finance.p.rapidapi.com/mo/module/?symbol={Code}&module=default-key-statistics,financial-data,income-statement,cashflow-statement,balance-sheet";

            string response = await _apiClient.GetData(url);

            return response;
        }
    }
}
