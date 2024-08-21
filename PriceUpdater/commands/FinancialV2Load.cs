using System;
using System.Threading.Tasks;
using CommonLib.ISS;
using CommonLib.Yahoo;
using Messaging.Messages;
using Newtonsoft.Json.Linq;

namespace PriceUpdater.commands
{
    public class FinancialV2Load {

        private readonly YahooV2Client _client = null;
        private readonly RabbitSender _rabbitSender = null;
        public FinancialV2Load(YahooV2Client client, RabbitSender rabbitSender) {

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
                        

                        JObject obj = JObject.Parse(resp);

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