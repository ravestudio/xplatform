using System.Threading.Tasks;
using CommonLib.Yahoo;
using Messaging.Messages;

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

                apiClient.addHeader("x-rapidapi-host", "mboum-finance.p.rapidapi.com");
                apiClient.addHeader("x-rapidapi-key", "d8c3e2c892msh13cac0704b75eb0p115a47jsn5be47ce5097d");

                foreach (string code in msg.Codes)
                {
                    string resp = await yahooClient.GetFinancial(code);

                    var respMsg = new YahooReceived () {
                        Code = code,
                        Response = resp
                    };

                    _rabbitSender.PublishMessage<YahooReceived>(respMsg, "financial.update");
                                
                }

            }

            return "ok";
        }

    }
}