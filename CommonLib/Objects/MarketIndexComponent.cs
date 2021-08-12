using System;
using System.Collections.Generic;
using System.Text;

namespace CommonLib.Objects
{
    public class MarketIndexComponent
    {
        public Guid Id { get; set; }
        public string Code { get; set; }

        public Guid? MarketIndexId { get; set; }
        public MarketIndex MarketIndex { get; set; }
    }
}
