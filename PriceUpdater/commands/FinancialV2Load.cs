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
                        string info = await this._client.GetInfo(code);


                        JObject obj = JObject.Parse(resp);
                        JObject objInfo = JObject.Parse(info);

                        JObject financialData = new JObject();
                        JObject keyStatistics = new JObject();
                        JObject assetProfile = new JObject();


                        financialData["financialCurrency"] = objInfo["financialCurrency"];

                        assetProfile["address1"] = objInfo["address1"];
                        assetProfile["city"] = objInfo["city"];
                        assetProfile["zip"] = objInfo["zip"];
                        assetProfile["phone"] = objInfo["phone"];
                        assetProfile["fax"] = objInfo["fax"];
                        assetProfile["website"] = objInfo["website"];
                        assetProfile["industry"] = objInfo["industry"];
                        assetProfile["industryKey"] = objInfo["industryKey"];
                        assetProfile["industryDisp"] = objInfo["industryDisp"];
                        assetProfile["sector"] = objInfo["sector"];
                        assetProfile["sectorKey"] = objInfo["sectorKey"];
                        assetProfile["sectorDisp"] = objInfo["sectorDisp"];
                        assetProfile["longBusinessSummary"] = objInfo["longBusinessSummary"];

                        keyStatistics["floatShares"] = objInfo["floatShares"];
                        keyStatistics["sharesOutstanding"] = objInfo["sharesOutstanding"];

                        obj["defaultKeyStatistics"] = keyStatistics;
                        obj["assetProfile"] = assetProfile;
                        obj["financialData"] = financialData;


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