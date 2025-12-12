using migrationUtils.DataAccess;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace migrationUtils.Migrations
{
    class ListDictionaries
    {
        private readonly string _connection;
        public ListDictionaries(string connectionString)
        {
            _connection = connectionString;

        }

        public void Execut()
        {
            IList<string> inspect = new List<string>()
            {
                "ChangeInWorkingCapital",
                /*"ChangeInOtherCurrentLiabilities",
                "ChangeInOtherCurrentAssets",
                "ChangeInOtherWorkingCapital",
                "ChangeInPayablesAndAccruedExpense",*/
                //"ChangeInAccountPayable"
            };

            IList<string> propsList = new List<string>();

            IList<string> toInspectList = new List<string>();

            using (var dbContext = new XContext(_connection))
            {
                var financeQuery = dbContext.FinanceAnnualSet;

                var processed = 0;

                foreach (var finance in financeQuery)
                {
                    var financial = JObject.Parse(finance.Data);

                    JObject? cashflow = (JObject?)financial["cashflowStatement"];

                    var props = cashflow?.Properties().Select(p => p.Name).ToList();

                    if (props != null)
                    {
                        foreach(var prop in props)
                        {
                            if (!propsList.Contains(prop))
                            {
                                propsList.Add(prop);
                            }

                            if (inspect.Contains(prop))
                            {
                                toInspectList.Add(string.Format("{0}, {1}",finance.Code, finance.Year));

                            }
                        }
                    }

                    processed += 1;

                    Console.Clear();
                    Console.WriteLine("Processed:{0}", processed);
                }
            }

            foreach (var prop in propsList) {

                if (prop.StartsWith("ChangeIn")) {
                    Console.WriteLine(prop);
                }
            }

            foreach (var item in toInspectList)
            {
                Console.WriteLine(item);

            }

        }
    }
}
