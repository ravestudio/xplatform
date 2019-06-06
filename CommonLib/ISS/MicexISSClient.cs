using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace CommonLib.ISS
{
    public class MicexISSClient
    {
        private WebApiClient _apiClient = null;
        public MicexISSClient(WebApiClient apiClient)
        {
            _apiClient = apiClient;

        }

        public Task<ISSResponse> GetSecurityInfo(string security)
        {
            string url = string.Format("http://iss.moex.com/iss/engines/stock/markets/shares/boards/TQBR/securities/{0}.xml", security);

            TaskCompletionSource<ISSResponse> TCS = new TaskCompletionSource<ISSResponse>();

            _apiClient.GetData(url).ContinueWith(t =>
            {
                ISSResponse response = new ISSResponse();
                response.SecurityInfo = new List<SecurityInfo>();
                response.MarketData = new List<MarketData>();

                string data = t.Result;
                XDocument doc = XDocument.Parse(data);

                XElement securities = GetDataBlock(doc, "securities");
                XElement security_rows = GetRows(securities);

                foreach (XElement el in security_rows.Elements())
                {
                    SecurityInfo info = new SecurityInfo()
                    {
                        BoardId = GetAttribute(el, "boardid"),
                        Code = GetAttribute(el, "secid"),
                        PREVLEGALCLOSEPRICE = decimal.Parse(GetAttribute(el, "PREVLEGALCLOSEPRICE"), CultureInfo.InvariantCulture)
                    };
                    response.SecurityInfo.Add(info);
                }

                XElement marketdata = GetDataBlock(doc, "marketdata");
                XElement marketdata_rows = GetRows(marketdata);

                foreach (XElement el in marketdata_rows.Elements())
                {

                    string currentPrice = GetAttribute(el, "LCURRENTPRICE");
                    string openPrice = GetAttribute(el, "OPENPERIODPRICE");

                    MarketData market = new MarketData()
                    {
                        Code = GetAttribute(el, "secid"),
                        LCURRENTPRICE = string.IsNullOrEmpty(currentPrice) ? 0m : decimal.Parse(currentPrice, CultureInfo.InvariantCulture),
                        OPENPERIODPRICE = string.IsNullOrEmpty(openPrice) ? 0m : decimal.Parse(openPrice, CultureInfo.InvariantCulture),
                    };

                    response.MarketData.Add(market);
                }

                TCS.SetResult(response);
            });

            return TCS.Task;
        }

        public XElement GetDataBlock(XDocument xml, string block_id)
        {
            XElement block = null;

            var elements = xml.Element("document").Elements();

            block = elements.SingleOrDefault(e => e.Attribute("id").Value == block_id);

            return block;
        }

        public XElement GetRows(XElement element)
        {
            return element.Elements().SingleOrDefault(e => e.Name == "rows");
        }

        public string GetAttribute(XElement element, string attr)
        {
            return element.Attributes().Single(a => a.Name.ToString().ToUpper() == attr.ToUpper()).Value;
        }
    }
}
