using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace CommonLib
{
    public class WebApiClient
    {
        System.Net.Http.HttpClient httpClient = new System.Net.Http.HttpClient();

        public void addHeader(string name, string value)
        {
            httpClient.DefaultRequestHeaders.Add(name, value);
        }
        public async Task<string> GetData(string url)
        {
            string responseBody = null;

            var uri = new Uri(url);

            System.Net.Http.HttpResponseMessage response = await httpClient.GetAsync(uri);

            response.EnsureSuccessStatusCode();
            
            responseBody = response.Content.ReadAsStringAsync().Result;

            return responseBody;
        }

        public async Task<string> PostDataAsync(string url, HttpContent body)
        {
            string responseBody = null;

            var uri = new Uri(url);

            httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            System.Net.Http.HttpResponseMessage response = await httpClient.PostAsync(uri, body);

            if (response.IsSuccessStatusCode)
            {
                responseBody = response.Content.ReadAsStringAsync().Result;
            }

            return responseBody;
        }

        public async void DeleteAsync(string url)
        {
            var uri = new Uri(url);

            System.Net.Http.HttpResponseMessage response = await httpClient.DeleteAsync(uri);
        }

        public Task<bool> PutData(string url, List<KeyValuePair<string, string>> data)
        {
            TaskCompletionSource<bool> TCS = new TaskCompletionSource<bool>();

            var uri = new Uri(url);
            System.Net.Http.HttpContent content = new System.Net.Http.FormUrlEncodedContent(data);

            string text = string.Empty;


            Task<System.Net.Http.HttpResponseMessage> response = httpClient.PutAsync(uri, content);

            response.ContinueWith(r =>
            {
                TCS.SetResult(r.Result.IsSuccessStatusCode);
            }, TaskContinuationOptions.OnlyOnRanToCompletion);

            return TCS.Task;
        }
    }
}
