using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Net.Http;
using System.Reflection.Metadata;
using System.Text;
using System.Threading.Tasks;

namespace CommonLib.Yahoo
{
    public class YahooV2Client
    {
        private WebApiClient _apiClient = null;
        public YahooV2Client(WebApiClient apiClient)
        {
            _apiClient = apiClient;
        }

        public async Task<string> GetFinancial(string Code)
        {
            //private
            string url = $"https://yahoo-finance160.p.rapidapi.com/financials";

            HttpContent Content = new StringContent($"{{\"stock\":\"{Code}\"}}")
            {
                Headers =
                {
                    ContentType = new MediaTypeHeaderValue("application/json")
                }
            };

            string response = await _apiClient.PostDataAsync(url, Content);

            return response;
        }

        public async Task<string> GetInfo(string Code)
        {
            //private
            string url = $"https://yahoo-finance160.p.rapidapi.com/info";

            HttpContent Content = new StringContent($"{{\"stock\":\"{Code}\"}}")
            {
                Headers =
                {
                    ContentType = new MediaTypeHeaderValue("application/json")
                }
            };

            string response = await _apiClient.PostDataAsync(url, Content);

            return response;
        }

    }
}
