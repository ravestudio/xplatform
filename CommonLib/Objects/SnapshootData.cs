using System;
using System.Collections.Generic;
using System.Text;

namespace CommonLib.Objects
{
    public class SnapshootData
    {
        public Guid Id { get; set; }

        public DateTime ChangeDate { get; set; }
        public string Data { get; set; }
    }
}
