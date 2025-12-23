using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace CommonLib.Objects
{
    public class Dividend
    {
        public int id { get; set; }
        public decimal dividendNet { get; set; }

        [Column(TypeName = "timestamp without time zone")]
        public DateTime paymentDate { get; set; }

        [Column(TypeName = "timestamp without time zone")]
        public DateTime declaredDate { get; set; }

        [Column(TypeName = "timestamp without time zone")]
        public DateTime lastBuyDate { get; set; }
        public int securityId { get; set; }

        [JsonIgnore]
        public Security Security { get; set; }
        public bool processed { get; set; }
    }
}
