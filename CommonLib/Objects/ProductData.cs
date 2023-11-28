using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CommonLib.Objects
{
    public class ProductData
    {
        public Guid Id { get; set; }

        public DateTime ChangeDate { get; set; }
        public string Data { get; set; }
    }
}
