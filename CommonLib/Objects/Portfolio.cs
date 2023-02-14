using System;
using System.Collections.Generic;
using System.Text;

namespace CommonLib.Objects
{
    public class Portfolio
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public ICollection<PortfolioAccounts> PortfolioAccounts { get; set; }

    }
}
