using System;
using System.Collections.Generic;
using System.Text;

namespace CommonLib.ISS
{
    public class ISSResponse
    {
        public IList<SecurityInfo> SecurityInfo { get; set; }
        public IList<MarketData> MarketData { get; set; }
    }
}
