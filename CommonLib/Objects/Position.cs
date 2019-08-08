using System;
using System.Collections.Generic;
using System.Text;

namespace CommonLib.Objects
{
    public class Position
    {
        public int Id { get; set; }
        public DateTime OpenDate { get; set; }

        public int securityId { get; set; }
        public Security Security { get; set; }

        public int accountId { get; set; }
        public Account Account { get; set; }

        public int Limit { get; set; }

    }
}
