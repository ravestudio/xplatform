using System;
using System.Collections.Generic;
using System.Text;

namespace CommonLib.Objects
{

    public class SecurityStatistics
    {
        public int? SecurityId { get; set; }
        public Security Security { get; set; }
        public string Data { get; set; }
        public DateTime CreateDate { get; set; }
    }
}
