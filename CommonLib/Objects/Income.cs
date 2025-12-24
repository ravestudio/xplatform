using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CommonLib.Objects
{
    public class Income
    {
        public int id { get; set; }
        public string incomeType { get; set; }
        public string sourse { get; set; }

        [Column(TypeName = "timestamp without time zone")]
        public DateTime paymentDate { get; set; }
        public decimal volume { get; set; }
        public decimal taxes { get; set; }
    }
}
