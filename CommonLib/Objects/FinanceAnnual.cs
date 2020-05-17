using System;
using System.Collections.Generic;
using System.Text;

namespace CommonLib.Objects
{
    public class FinanceAnnual
    {
        public Guid Id { get; set; }
        public string Code { get; set; }
        public int Year { get; set; }
        public string Data { get; set; }
        public DateTime CreateDate { get; set; }
    }
}
