using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace xplatform.Model
{
    public class PortfolioCost
    {
        public PortfolioCost()
        {
            Items = new List<PortfolioItem>();
        }

        public void AddItem(string code, string name, int limit, decimal cost, string type)
        {
            Items.Add(new PortfolioItem()
            {
                Code = code,
                Name = name,
                Limit = limit,
                Cost = cost,
                Type = type
            });
        }

        public IList<PortfolioItem> Items { get; set; }
        public decimal SharesTotal { get; set; }
        public decimal BondsTotal { get; set; }

        public decimal SharesPerc { get; set; }
        public decimal BondsPerc { get; set; }
    }

    public class PortfolioItem
    {
        public string Code { get; set; }
        public string Name { get; set; }
        public int Limit { get; set; }
        public decimal Cost { get; set; }

        public string Type { get; set; }
    }
}


