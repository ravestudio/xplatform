using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace xplatform.Model
{
    public class ImportRequest
    {
        public string Object { get; set; }

        public string[] ISIN { get; set; }
    }
}
