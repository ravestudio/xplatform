using System;
using System.Collections.Generic;
using System.Text;

namespace CommonLib.Objects
{
    public class Quote
    {
        public string figi { get; set; }
        public string symbol { get; set; }
        public DateTime? lastUpdate { get; set; }
        public decimal open { get; set; }
        public decimal price { get; set; }

        public decimal? NKD { get; set; }
        public decimal previousClose { get; set; }
        public decimal change { get; set; }

        public string Board { get; set; }

    }
}
