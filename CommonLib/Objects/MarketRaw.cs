using System;
using System.Collections.Generic;
using System.Text;

namespace CommonLib.Objects
{
    public class MarketRaw
    {
        public string name { get; set; }
        public string symbol { get; set; }
        public string board { get; set; }
        public int lotSize { get; set; }
    }
}
