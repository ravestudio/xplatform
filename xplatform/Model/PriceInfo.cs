using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace xplatform.Model
{
    public class PriceInfo
    {
        public string Code { get; set; }

        public decimal PrevClose { get; set; }
        public decimal LastPrice { get; set; }
        public decimal OpenPrice { get; set; }
        public decimal Change { get; set; }
        
    }
}
