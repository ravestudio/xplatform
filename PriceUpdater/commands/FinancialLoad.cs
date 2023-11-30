using System;
using System.Threading.Tasks;
using CommonLib.ISS;
using CommonLib.Yahoo;
using Messaging.Messages;
using Newtonsoft.Json.Linq;

namespace PriceUpdater.commands
{
    public class FinancialLoad {

        private readonly YahooClient _client = null;
        private readonly RabbitSender _rabbitSender = null;
        public FinancialLoad(YahooClient client, RabbitSender rabbitSender) {

            this._client = client;
            this._rabbitSender = rabbitSender;
        }

        public async Task<string> Exec(string message)
        {
            var msg = System.Text.Json.JsonSerializer.Deserialize<Yahoo>(message);

            if (msg != null)
            {

                foreach (string code in msg.Codes)
                {
                    try
                    {
                        string resp = await this._client.GetFinancial(code);
                        string summary = await this._client.GetSummary(code);

                        JObject obj = JObject.Parse(resp);
                        JObject objSummary = JObject.Parse(summary);

                        if (objSummary["defaultKeyStatistics"] != null)
                        {
                            obj["defaultKeyStatistics"] = objSummary["defaultKeyStatistics"];
                        }

                        if (objSummary["summaryProfile"] != null)
                        {
                            obj["assetProfile"] = objSummary["summaryProfile"];
                        }

                        if (objSummary["financialData"] != null)
                        {
                            obj["financialData"] = objSummary["financialData"];
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