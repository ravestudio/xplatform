using System;
using System.Collections.Generic;
using System.Text;

namespace CommonLib.Objects
{
    public class MarketIndex
    {
        public Guid Id { get; set; }
        public string Name { get; set; }

        public ICollection<MarketIndexComponent> Constituents { get; set; }
        public ICollection<MarketIndexChanges> Changes { get; set; }
    }
}
