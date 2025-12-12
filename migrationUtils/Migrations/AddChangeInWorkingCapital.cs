using migrationUtils.DataAccess;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace migrationUtils.Migrations
{
    class AddChangeInWorkingCapital
    {
        private readonly string _connection;

        public AddChangeInWorkingCapital(string connectionString)
        {
            _connection = connectionString;

        }

        public void Execut()
        {
            Func<JToken?, string, decimal> getValue = (token, field) =>
            {
                JToken? value = token?[field];

                //JToken value = tokenField?.HasValues ?? false ? tokenField["raw"] ?? 0 : 0;

                return (decimal)(value ?? 0);
            };

            Func<JToken?, decimal> getNWC = (token) =>
            {
                var ChangeInPayable = getValue(token, "ChangeInPayable");
                var ChangeInInventory = getValue(token, "ChangeInInventory");
                var ChangeInReceivables = getValue(token, "ChangeInReceivables");
                var ChangeInPrepaidAssets = getValue(token, "ChangeInPrepaidAssets");

                return ChangeInPayable + ChangeInInventory + ChangeInReceivables + ChangeInPrepaidAssets;
            };

            IList<string> propsList = new List<string>();

            IList<string> toInspectList = new List<string>();

            using (var dbContext = new XContext(_connection))
            {

                var financeList = dbContext.FinanceAnnualSet.ToList();

                var processed = 0;

                foreach (var finance in financeList)
                {
                    var financial = JObject.Parse(finance.Data);

                    var cashflow = financial["cashflowStatement"];

                    var nwc = cashflow["ChangeInWorkingCapital"];

                    //var props = cashflow?.Properties().Select(p => p.Name).ToList();

                    if (nwc == null)
                    {
                        /*if (!props.Contains("ChangeInWorkingCapital") && cashflow != null)
                        {
                            cashflow["ChangeInWorkingCapital"] = getNWC(cashflow);
                        }*/

                        cashflow["ChangeInWorkingCapital"] = getNWC(cashflow);


                        /*finance.Data = financial.ToString();
                        dbContext.SaveChanges();*/
                    }

                    processed += 1;

                    Console.Clear();
                    Console.WriteLine("Processed:{0}", processed);
                }

            }
        }
    }
}
