using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Messaging.Messages
{
    public class YahooFinancial
    {
        public string code { get; set; }
        public string name { get; set; }

        public string region { get; set; }
        public DateTime? loadDate { get; set; }
        public DateTime? lastFinance { get; set; }

        public string status { get; set; }

        public int rn { get; set; }

    }
}
