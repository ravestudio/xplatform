using CommonLib.Objects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace XCub
{
    public class MarketData
    {
        public Quote quote { get; set; }
        public string market { get; set; }
        public string board { get; set; }
        public string ticker { get; set; }
    }
}
