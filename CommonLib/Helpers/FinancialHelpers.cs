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

        public DateTime UnixTimeToDateTime(long unixtime)
        {
            System.DateTime dtDateTime = new DateTime(1970, 1, 1, 0, 0, 0, 0, System.DateTimeKind.Utc);
            dtDateTime = dtDateTime.AddSeconds(unixtime);
            return dtDateTime;
        }
    }
}
