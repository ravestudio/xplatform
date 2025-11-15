using Iot.Device.Mcp3428;
using Newtonsoft.Json.Linq;
using xplatform.Model;

namespace xplatform.Helpers
{
    public class FinancialHelpers
    {
        public JObject GetStatement<T>(FinancialModel model, decimal factor)
        {

            Type statement = typeof(T);


            var props = statement.GetProperties().Select(p => new JProperty(p.Name, (decimal?)p.GetValue(model) * factor));

            return new JObject(new JProperty("version", 2), props);
                
        }

        public decimal GetFactor(string unit)
        {
            if (unit == "thousands")
            {
                return 1000;
            }

            if (unit == "millions")
            {
                return 1000000;
            }

            return 1;
        }
    }
}
