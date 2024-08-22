using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace xplatform.Model
{
    public class ShareInfo
    {
        public string Code { get; set; }
        public string Emitent { get; set; }
        public string Currency { get; set; }
        public decimal Price { get; set; }
        public decimal PriceChange { get; set; }

        public string FinancialPage { get; set; }

        public int? LastFinancial { get; set; }
        public string Sector { get; set; }
    }
}
