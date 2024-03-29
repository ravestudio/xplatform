﻿using System;
using System.Collections.Generic;
using System.Text;

namespace CommonLib.Objects
{
    public class Emitent
    {
        public int Id { get; set; }

        public string Code {get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string WebSite { get; set; }

        public string FinancialPage { get; set; }

        public ICollection<Financial> Financials { get; set; }
        public ICollection<Security> Securities { get; set; }

        public ICollection<Note> Notes { get; set; }

        public EmitentProfile EmitentProfile { get; set; }
    }
}
