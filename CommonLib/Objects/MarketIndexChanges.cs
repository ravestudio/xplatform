using System;
using System.Collections.Generic;
using System.Text;

namespace CommonLib.Objects
{
    public class MarketIndexChanges
    {
        public Guid Id { get; set; }
        public DateTime Date { get; set; }
        public string Data { get; set; }
        public Guid? MarketIndexId { get; set; }
        public MarketIndex MarketIndex { get; set; }

        public Boolean Processed { get; set; }
    }
}
