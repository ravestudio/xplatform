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

        public FinancialModel GetModel(JObject obj)
        {
            Type model = typeof(FinancialModel);

            FinancialModel result = new FinancialModel();

            //var values = new List<JToken>();

            var incomeStatement = obj.GetValue("incomeStatement") as JObject;
            var balanceSheet = obj.GetValue("balanceSheet") as JObject;
            var cashflowStatement = obj.GetValue("cashflowStatement") as JObject;

            var flatObj = new JObject(
                incomeStatement.Properties().Where(p => p.Name != "version"),
                balanceSheet.Properties().Where(p => p.Name != "version"),
                cashflowStatement.Properties().Where(p => p.Name != "version"));

            /*values.AddRange(obj["incomeStatement"].);
            values.AddRange(obj["balanceSheet"]);
            values.AddRange(obj["cashflowStatement"]);*/

            foreach (var prop in model.GetProperties())
            {
                //var val = values.First();
                prop.SetValue(result, (decimal)flatObj[prop.Name]);
            }

            return result;
        }
    }
}
