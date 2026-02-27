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

            var filtered = props.Where(p => ((decimal?)p.Value) != null);

            return new JObject(new JProperty("version", 2), filtered);
                
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

        public FinancialModel GetModel(JObject obj, decimal factor)
        {
            Type model = typeof(FinancialModel);

            FinancialModel result = new FinancialModel();

            //var values = new List<JToken>();

            var incomeStatement = obj.GetValue("incomeStatement") as JObject;
            var balanceSheet = obj.GetValue("balanceSheet") as JObject;
            var cashflowStatement = obj.GetValue("cashflowStatement") as JObject;

            string[] excludProps = new string[] { "version", "endDate" };

            var flatObj = new JObject(
                incomeStatement.Properties().Where(p => !excludProps.Contains(p.Name)),
                balanceSheet.Properties().Where(p => !excludProps.Contains(p.Name)),
                cashflowStatement.Properties().Where(p => !excludProps.Contains(p.Name)));

            /*values.AddRange(obj["incomeStatement"].);
            values.AddRange(obj["balanceSheet"]);
            values.AddRange(obj["cashflowStatement"]);*/

            foreach (var prop in model.GetProperties())
            {
                decimal? val = (decimal?)flatObj[prop.Name];

                if (val != null)
                {
                    prop.SetValue(result, val / factor);
                }
            }

            return result;
        }
    }
}
