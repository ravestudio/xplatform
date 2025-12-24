using CommonLib.Model;
using CommonLib.Objects;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;
using Newtonsoft.Json.Linq;
using xplatform.DataAccess;
using xplatform.Model;

namespace xplatform.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly XContext _context;

        public ProductController(XContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IEnumerable<object> Get()
        {
            Func<KeyValuePair<string, PositionItem>, ProductItem> func = pos =>
            {
                var quote = _context.QuoteSet.Single(q => q.symbol == pos.Key);
                var price = pos.Value.Close.HasValue ? pos.Value.Close.Value : quote.price == 0 ? quote.previousClose : quote.price;
                var cost = pos.Value.Limit * pos.Value.Price;
                var currentCost = pos.Value.Limit * price;

                return new ProductItem()
                {
                    code = pos.Key,
                    date = pos.Value.DealDate,
                    limit = pos.Value.Limit,
                    price = pos.Value.Price,
                    cost = cost,
                    currentPrice = price,
                    close = pos.Value.Close,
                    currentCost = currentCost,
                    profit = currentCost - cost
                };
            };

            var productList = _context.ProductSet.ToList();

            var productModel = productList.Select(p => new Product(p.Id, JObject.Parse(p.Data)));

            var query = productModel.AsQueryable();

            var ds = query.Select(p => new
            {
                productId = p.ProductId,
                positions = p.PositionItems.Select(func)
            });

            var result = ds.ToList().Select(p => new
            {
                productId = p.productId,
                positions = p.positions,
                profit = p.positions.Sum(item => item.profit),
            });
            

            return result;
        }
    }
}
