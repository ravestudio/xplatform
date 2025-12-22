using CommonLib.Objects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Messaging.Messages
{
    public class Dividends
    {
        public string ISIN { get; set; }
        public IEnumerable<Dividend> dividends { get; set; }
    }
}
