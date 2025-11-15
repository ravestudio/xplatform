namespace xplatform.Model
{
    public class AddFinancialModel
    {
        public string Code { get; set; }
        public string Currency { get; set; }
        public string Unit { get; set; }

        public ICollection<AddFinancialItem> Financials { get; set; }

    }
    public class AddFinancialItem
    {
        public int Year { get; set; }
        public FinancialModel Data { get; set; }
    }

    public interface IIncomeStatement
    {
        decimal TotalRevenue { get; set; }
        decimal CostOfRevenue { get; set; }
        decimal SellingGeneralAndAdministration { get; set; }
        decimal NetIncome { get; set; }
        decimal TotalExpenses { get; set; }
        decimal TaxProvision { get; set; }
        decimal InterestIncome { get; set; }
        decimal InterestExpense { get; set; }
    }

    public interface IBalanceSheet
    {
        decimal CurrentLiabilities { get; set; }
        decimal TotalLiabilitiesNetMinorityInterest { get; set; }
        decimal CurrentAssets { get; set; }
        decimal TotalAssets { get; set; }
        decimal StockholdersEquity { get; set; }
        decimal MinorityInterest { get; set; }
    }

    public interface ICashflowStatement
    {
        decimal Depreciation { get; set; }
        decimal InvestingCashFlow { get; set; }
        decimal PurchaseOfPPE { get; set; }

        decimal RepurchaseOfCapitalStock { get; set; }
        decimal CashDividendsPaid { get; set; }
        decimal ChangeInPayable { get; set; }
        decimal ChangeInInventory { get; set; }
        decimal ChangeInReceivables { get; set; }
        decimal ChangeInPrepaidAssets { get; set; }

        decimal OperatingCashFlow { get; set; }
        decimal FinancingCashFlow { get; set; }
    }
    public class FinancialModel : IIncomeStatement, IBalanceSheet, ICashflowStatement
    {
        //income
        public decimal TotalRevenue { get; set; }
        public decimal SellingGeneralAndAdministration { get; set; }
        public decimal NetIncome { get; set; }
        public decimal TotalExpenses { get; set; }
        public decimal CostOfRevenue { get; set; }
        public decimal TaxProvision { get; set; }
        public decimal InterestIncome { get; set; }
        public decimal InterestExpense { get; set; }

        //balance
        public decimal CurrentLiabilities { get; set; }
        public decimal TotalLiabilitiesNetMinorityInterest { get; set; }
        public decimal CurrentAssets { get; set; }
        public decimal TotalAssets { get; set; }
        public decimal StockholdersEquity { get; set; }
        public decimal MinorityInterest { get; set; }

        //flow
        public decimal Depreciation { get; set; }
        public decimal InvestingCashFlow { get; set; }
        public decimal PurchaseOfPPE { get; set; }

        public decimal RepurchaseOfCapitalStock { get; set; }
        public decimal CashDividendsPaid { get; set; }
        public decimal ChangeInPayable { get; set; }
        public decimal ChangeInInventory { get; set; }
        public decimal ChangeInReceivables { get; set; }
        public decimal ChangeInPrepaidAssets { get; set; }

        public decimal OperatingCashFlow { get; set; }
        public decimal FinancingCashFlow { get; set; }
    }
}
