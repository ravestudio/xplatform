using System;
using System.Collections.Generic;
using System.Text;

namespace CommonLib.Objects
{
    public class PortfolioAccounts
    {
        public int? AccountId { get; set; }
        public Account Account { get; set; }

        public int? PortfolioId { get; set; }
        public Portfolio Portfolio { get; set; }
    }
}
