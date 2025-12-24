using CommonLib.Model;
using CommonLib.Objects;
using Newtonsoft.Json.Linq;

namespace xplatform.Model
{
    public class Product
    {
        public Product(Guid productId, JToken productObj)
        {
            ProductId = productId;
            this.PositionItems = new Dictionary<string, PositionItem>(productObj["positions"].Select(i =>
            new KeyValuePair<string, PositionItem>((string)i["security"], new PositionItem() 
            {
                DealDate = (DateTime)i["date"],
                Limit = (int)i["limit"],
                Price = (decimal)i["price"],
                Close = (decimal?)i["close"]
            })));
        }
        public Product()
        {
            this.PositionItems = new Dictionary<string, PositionItem>();
        }
        public IDictionary<string, PositionItem> PositionItems { get; set; }

        public Guid ProductId { get; set; }
    }

    public class ProductItem
    {
        public string code { get; set; }
        public DateTime date { get; set; }
        public int limit { get; set; }
        public decimal price { get; set; }

        public decimal? close { get; set; }
        public decimal cost { get; set; }
        public decimal currentPrice { get; set; }
        public decimal currentCost { get; set; }
        public decimal profit { get; set; }
    }
}
