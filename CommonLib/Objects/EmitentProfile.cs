using System;
using System.Collections.Generic;
using System.Text;

namespace CommonLib.Objects
{
    public class EmitentProfile
    {
        public int? EmitentId { get; set; }
        public Emitent Emitent { get; set; }
        public string Data { get; set; }
        public DateTime CreateDate { get; set; }
    }
}
