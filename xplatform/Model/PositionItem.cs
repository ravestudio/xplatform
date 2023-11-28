using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace xplatform.Model
{
    public class PositionItem
    {
        public DateTime DealDate { get; set; }
        public int Limit { get; set; }

        public decimal Price { get; set; }

        public decimal? Close { get; set; }

        public int v { get; set; }

    }
}
