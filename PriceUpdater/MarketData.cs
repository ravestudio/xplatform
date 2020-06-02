using CommonLib.Objects;
using System;
using System.Collections.Generic;
using System.Text;

namespace PriceUpdater
{
    public class MarketData
    {
        public Quote quote {get; set;}
        public string market { get; set; }
        public string board { get; set; }
        public string ticker { get; set; }
    }
}
