﻿using System;
using System.Collections.Generic;
using System.Text;

namespace CommonLib.Objects
{
    public class Security
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }

        public string Region { get; set; }
        public string Currency { get; set; }

        public int EmitentId { get; set; }
        public Emitent Emitent { get; set; }

        public ICollection<Deal> Deals { get; set; }
        public ICollection<Position> Positions { get; set; }

        public decimal? NominalPrice { get; set; }

        public string Market { get; set; }
        public string Board { get; set; }
    }
}
