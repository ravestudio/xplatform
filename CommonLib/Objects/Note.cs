using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CommonLib.Objects
{
    public class Note
    {
        public Guid Id { get; set; }

        public int? EmitentId { get; set; }
        public Emitent Emitent { get; set; }
        public DateTime ChangeDate { get; set; }
        public string Data { get; set; }
    }
}
