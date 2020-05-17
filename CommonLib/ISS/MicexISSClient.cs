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

        public Task<ISSResponse> GetSecurityInfo(string market, string board, string security)
        {
            string url = string.Format("http://iss.moex.com/iss/engines/stock/markets/{0}/boards/{1}/securities/{2}.xml", market, board, security);

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

                    if (market == "bonds")
                    {
                        info.NKD = decimal.Parse(GetAttribute(el, "ACCRUEDINT"), CultureInfo.InvariantCulture);
                    }

                    response.SecurityInfo.Add(info);
                }

                XElement marketdata = GetDataBlock(doc, "marketdata");
                XElement marketdata_rows = GetRows(marketdata);

                foreach (XElement el in marketdata_rows.Elements())
                {
                    string last = GetAttribute(el, "LAST");
                    string open = GetAttribute(el, "OPEN");
                    string currentPrice = GetAttribute(el, "LCURRENTPRICE");
                    string openPrice = GetAttribute(el, "OPENPERIODPRICE");

                    MarketData market = new MarketData()
                    {
                        Code = GetAttribute(el, "secid"),
                        LAST = string.IsNullOrEmpty(last) ? 0m : decimal.Parse(last, CultureInfo.InvariantCulture),
                        OPEN = string.IsNullOrEmpty(open) ? 0m : decimal.Parse(open, CultureInfo.InvariantCulture),
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
