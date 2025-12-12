using CommonLib.Model;
using Newtonsoft.Json.Linq;
using System;
using System.Linq;

namespace CommonLib.Helpers
{
    public class FinancialHelpers
    {
        public JObject GetStatement<T>(FinancialModel model, decimal factor)
        {

            Type statement = typeof(T);


            var props = statement.GetProperties().Select(p => new JProperty(p.Name, (decimal?)p.GetValue(model) * factor));

            return new JObject(new JProperty("version", 2), props);

        }
    }
}
