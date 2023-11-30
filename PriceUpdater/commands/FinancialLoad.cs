using System;
using System.Threading.Tasks;
using CommonLib.Yahoo;
using Messaging.Messages;
using Newtonsoft.Json.Linq;

namespace PriceUpdater.commands
{
    public class FinancialLoad {
        
        private readonly RabbitSender _rabbitSender = null;
        public FinancialLoad(RabbitSender rabbitSender) {

            this._rabbitSender = rabbitSender;
        }

        public async Task<string> Exec(string message)
        {
            var msg = System.Text.Json.JsonSerializer.Deserialize<Yahoo>(message);

            if (msg != null)
            {

                var apiClient = new CommonLib.WebApiClient();
                YahooClient yahooClient = new YahooClient(apiClient);

                apiClient.addHeader("x-rapidapi-host", "apidojo-yahoo-finance-v1.p.rapidapi.com");
                apiClient.addHeader("x-rapidapi-key", "d8c3e2c892msh13cac0704b75eb0p115a47jsn5be47ce5097d");

                foreach (string code in msg.Codes)
                {
                    try
                    {
                        string resp = await yahooClient.GetFinancial(code);
                        string respStat = await yahooClient.SetStatistic(code);

                        JObject obj = JObject.Parse(resp);
                        JObject objStat = JObject.Parse(respStat);

                        if (objStat["quoteSummary"] != null)
                        {
                            obj["defaultKeyStatistics"] = objStat["quoteSummary"]["result"][0]["defaultKeyStatistics"];
                        }

                        var respMsg = new YahooReceived()
                        {
                            Code = code,
                            Response = obj.ToString()
                        };

                        _rabbitSender.PublishMessage<YahooReceived>(respMsg, "yahoo.update");
                    }
                    catch(Exception ex)
                    {
                        Console.WriteLine(ex.Message);
                    }
                                
                }

            }

            return "ok";
        }

    }
}