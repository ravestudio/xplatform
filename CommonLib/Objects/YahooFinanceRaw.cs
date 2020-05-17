using System;
using System.Collections.Generic;
using System.Text;

namespace CommonLib.Objects
{
    public class YahooFinanceRaw
    {
        public Guid Id { get; set; }

        public string Code { get; set; }
        public string Data { get; set; }

        public DateTime LoadDate { get; set; }

        public DateTime LastFinance { get; set; }

        public bool Processed { get; set; }

    }
}
