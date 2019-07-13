using System;
using System.Collections.Generic;
using System.Text;

namespace CommonLib.Services
{
    public class MarketInfo
    { 
    
        public MarketInfo()
        {
            this.MarketDataValues = new Dictionary<string, ISS.MarketData>();
        }

        public Dictionary<string, ISS.MarketData> MarketDataValues { get; set; }
    }
}
