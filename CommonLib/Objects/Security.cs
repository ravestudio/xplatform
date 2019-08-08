using System;
using System.Collections.Generic;
using System.Text;

namespace CommonLib.Objects
{
    public class Security
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }

        public int EmitentId { get; set; }
        public Emitent Emitent { get; set; }

        public ICollection<Deal> Deals { get; set; }
        public ICollection<Position> Positions { get; set; }
    }
}
