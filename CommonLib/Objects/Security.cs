using System;
using System.Collections.Generic;
using System.Text;

namespace CommonLib.Objects
{
    public class Security
    {
        public int Id { get; set; }
        public string ISIN { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public string FinancialPage { get; set; }
        public string Region { get; set; }
        public string Currency { get; set; }

        public int? EmitentId { get; set; }
        public Emitent Emitent { get; set; }

        public ICollection<Deal> Deals { get; set; }
        public ICollection<Position> Positions { get; set; }

        public SecurityStatistics SecurityStatistics { get; set; }

        public string Type { get; set; }

    }

    public class Share : Security
    {

    }

    public class Bond : Security
    {
        public decimal NominalPrice { get; set; }
    }

    public class ETF : Security
    {
        public string Structure { get; set; }
    }

    public class Currency : Security
    {

    }
}
