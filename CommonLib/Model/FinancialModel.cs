using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CommonLib.Model
{
    public interface IIncomeStatement
    {
        decimal TotalRevenue { get; set; }
        decimal CostOfRevenue { get; set; }
        decimal OperatingIncome { get; set; }
        decimal NetIncome { get; set; }
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
        decimal ImpairmentOfCapitalAssets { get; set; }
        decimal ChangeInPayable { get; set; }
        decimal ChangeInInventory { get; set; }
        decimal ChangeInReceivables { get; set; }
        decimal ChangeInPrepaidAssets { get; set; }
        decimal OperatingCashFlow { get; set; }
        decimal CapitalExpenditure { get; set; }
        decimal InvestingCashFlow { get; set; }
        decimal RepurchaseOfCapitalStock { get; set; }
        decimal CashDividendsPaid { get; set; }
        decimal FinancingCashFlow { get; set; }
    }
    public class FinancialModel : IIncomeStatement, IBalanceSheet, ICashflowStatement
    {
        //income
        public decimal TotalRevenue { get; set; }
        public decimal CostOfRevenue { get; set; }
        public decimal OperatingIncome { get; set; }
        public decimal InterestIncome { get; set; }
        public decimal InterestExpense { get; set; }
        public decimal TaxProvision { get; set; }
        public decimal NetIncome { get; set; }

        //balance
        public decimal CurrentLiabilities { get; set; }
        public decimal TotalLiabilitiesNetMinorityInterest { get; set; }
        public decimal CurrentAssets { get; set; }
        public decimal TotalAssets { get; set; }
        public decimal StockholdersEquity { get; set; }
        public decimal MinorityInterest { get; set; }

        //flow
        public decimal Depreciation { get; set; }
        public decimal ImpairmentOfCapitalAssets { get; set; }
        public decimal ChangeInPayable { get; set; }
        public decimal ChangeInInventory { get; set; }
        public decimal ChangeInReceivables { get; set; }
        public decimal ChangeInPrepaidAssets { get; set; }
        public decimal OperatingCashFlow { get; set; }
        public decimal CapitalExpenditure { get; set; }
        public decimal InvestingCashFlow { get; set; }
        public decimal RepurchaseOfCapitalStock { get; set; }
        public decimal CashDividendsPaid { get; set; }
        public decimal FinancingCashFlow { get; set; }
    }
}
