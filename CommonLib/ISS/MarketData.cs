using System;
using System.Collections.Generic;
using System.Text;

namespace CommonLib.ISS
{
    public class MarketData
    {
        public string Code { get; set; }

        public decimal LCURRENTPRICE { get; set; }
        public decimal OPENPERIODPRICE { get; set; }
    }
}
