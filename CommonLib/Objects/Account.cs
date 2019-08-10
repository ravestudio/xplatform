using System;
using System.Collections.Generic;
using System.Text;

namespace CommonLib.Objects
{
    public class Account
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public ICollection<Deal> Deals { get; set; }
        public ICollection<Position> Positions { get; set; }
    }
}
