using System.Collections;
using System.Collections.Generic;

namespace xplatform.Model
{
    public class UpdateModel
    {
        public string Code { get; set; }
        public IDictionary<string, string> Values { get; set; }
    }
}
