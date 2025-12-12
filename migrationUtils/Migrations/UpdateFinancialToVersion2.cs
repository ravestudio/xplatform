using CommonLib.Helpers;
using CommonLib.Model;
using migrationUtils.DataAccess;
using Newtonsoft.Json.Linq;


namespace migrationUtils.Migrations
{
    internal class UpdateFinancialToVersion2
    {
        private readonly string _connection;
        public UpdateFinancialToVersion2(string connectionString)
        {
            _connection = connectionString;

        }
        public void Execut()
        {

            Func<JToken?, string, decimal> getValue = (token, field) =>
            {
                JToken? tokenField = token?[field];

                JToken value = tokenField?.HasValues ?? false ? tokenField["raw"] ?? 0 : 0;

                return (decimal)value;
            };

            Func<JToken?, decimal> getNWC = (token) =>
            {

                var changeToLiabilities = getValue(token, "changeToLiabilities");
                var changeToInventory = getValue(token, "changeToInventory");
                var changeToAccountReceivables = getValue(token, "changeToAccountReceivables");
                var changeToOperatingActivities = getValue(token, "changeToOperatingActivities");

                return changeToLiabilities + changeToInventory + changeToAccountReceivables + changeToOperatingActivities;
            };

            var buildHelper = new FinancialHelpers();

            using (var dbContext = new XContext(_connection))
            {
                //var financeList = dbContext.FinanceAnnualSet.Where(f => f.Code == "SPBE.ME").ToList();
                //var financeList = dbContext.FinanceAnnualSet.Where(f => f.Code == "MTSS.ME").ToList();
                var financeList = dbContext.FinanceAnnualSet.ToList();

                var processed = 0;

                foreach (var finance in financeList)
                {

                    var financial = JObject.Parse(finance.Data);

                    var income = financial["incomeStatement"];
                    var balance = financial["balanceSheet"];
                    var cashflow = financial["cashflowStatement"];

                    int version = (int)(income?["version"] ?? 0);

                    if (version == 2)
                    {
                        continue;
                    }


                    var model = new FinancialModel()
                    {
                        TotalRevenue = getValue(income, "totalRevenue"),
                        CostOfRevenue = getValue(income, "costOfRevenue"),
                        OperatingIncome = getValue(income, "operatingIncome"),
                        //InterestIncome = getValue(income, "interestIncome"),
                        InterestExpense = getValue(income, "interestExpense") * -1,
                        TaxProvision = getValue(income, "incomeTaxExpense"),
                        NetIncome = getValue(income, "netIncome"),

                        CurrentLiabilities = getValue(balance, "totalCurrentLiabilities"),
                        TotalLiabilitiesNetMinorityInterest = getValue(balance, "totalLiab"),
                        CurrentAssets = getValue(balance, "totalCurrentAssets"),
                        TotalAssets = getValue(balance, "totalAssets"),
                        StockholdersEquity = getValue(balance, "totalStockholderEquity"),
                        MinorityInterest = getValue(balance, "minorityInterest"),


                        Depreciation = getValue(cashflow, "depreciation"),
                        ImpairmentOfCapitalAssets = getValue(cashflow, "impairmentOfCapitalAssets"),
                        //NWC = getNWC(cashflow),

                        ChangeInPayable = getValue(cashflow, "changeToLiabilities"),
                        ChangeInInventory = getValue(cashflow, "changeToInventory"),
                        ChangeInReceivables = getValue(cashflow, "changeToAccountReceivables"),
                        ChangeInPrepaidAssets = getValue(cashflow, "changeToOperatingActivities"),

                        OperatingCashFlow = getValue(cashflow, "totalCashFromOperatingActivities"),
                        CapitalExpenditure = getValue(cashflow, "capitalExpenditures"),
                        InvestingCashFlow = getValue(cashflow, "totalCashflowsFromInvestingActivities"),
                        RepurchaseOfCapitalStock = getValue(cashflow, "repurchaseOfStock"),
                        CashDividendsPaid = getValue(cashflow, "dividendsPaid"),
                        FinancingCashFlow = getValue(cashflow, "totalCashFromFinancingActivities"),
                    };

                    JObject reportData = new JObject(
                        new JProperty("incomeStatement", buildHelper.GetStatement<IIncomeStatement>(model, 1)),
                        new JProperty("balanceSheet", buildHelper.GetStatement<IBalanceSheet>(model, 1)),
                        new JProperty("cashflowStatement", buildHelper.GetStatement<ICashflowStatement>(model, 1))
                        );

                    finance.Data = reportData.ToString();
                    dbContext.SaveChanges();

                    processed += 1;

                    Console.Clear();
                    Console.WriteLine("Processed:{0}", processed);
                }

            }
        }
    }
}
