using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace CommonLib.Objects
{
    public class Financial
    {
        public int Id { get; set; }
        public int Year { get; set; }
        public int Period { get; set; }
        /// <summary>
        /// Выручка
        /// </summary>
        [Column(TypeName = "decimal(18, 2)")]
        public decimal Revenue { get; set; }

        /// <summary>
        /// Операционная прибыль
        /// </summary>
        [Column(TypeName = "decimal(18, 2)")]
        public decimal OperatingIncome { get; set; }

        /// <summary>
        /// операционные расходы
        /// </summary>
        public decimal OperatingExpenses
        {
            get { return this.Revenue - this.OperatingIncome; }
        }

        /// <summary>
        /// Чистая прибыль
        /// </summary>
        [Column(TypeName = "decimal(18, 2)")]
        public decimal NetIncome { get; set; }

        /// <summary>
        /// Оборотные активы
        /// </summary>
        [Column(TypeName = "decimal(18, 2)")]
        public decimal CurrentAssets { get; set; }

        /// <summary>
        /// Внеоборотные активы
        /// </summary>
        [Column(TypeName = "decimal(18, 2)")]
        public decimal FixedAssets { get; set; }

        /// <summary>
        /// Итого активы
        /// </summary>
        public decimal TotalAssets
        {
            get { return this.CurrentAssets + this.FixedAssets; }
        }

        /// <summary>
        /// Краткосрочные обязательства
        /// </summary>
        [Column(TypeName = "decimal(18, 2)")]
        public decimal CurrentLiabilities { get; set; }

        /// <summary>
        /// Долгосрочные обязательства
        /// </summary>
        [Column(TypeName = "decimal(18, 2)")]
        public decimal LongTermLiabilities { get; set; }

        /// <summary>
        /// Итого обязательства
        /// </summary>
        public decimal TotalLiabilities
        {
            get { return this.CurrentLiabilities + this.LongTermLiabilities; }
        }

        /// <summary>
        /// Капитал
        /// </summary>
        public decimal Equity
        {
            get { return this.TotalAssets - this.TotalLiabilities; }
        }

        /// <summary>
        /// Итого капитал и обязательства
        /// </summary>
        public decimal LiabilitiesAndEquity
        {
            get { return this.Equity + this.TotalLiabilities; }
        }

        [Column(TypeName = "decimal(18, 2)")]
        public decimal FlowOperatingActivities { get; set; }

        /// <summary>
        /// depreciation and amortization
        /// </summary>
        [Column(TypeName = "decimal(18, 2)")]
        public decimal Amortization { get; set; }

        /// <summary>
        /// Изменения в активах (NWC, Net working capital change)
        /// </summary>
        [Column(TypeName = "decimal(18, 2)")]
        public decimal NWC { get; set; }

        /// <summary>
        /// капитальные затраты 
        /// </summary>
        [Column(TypeName = "decimal(18, 2)")]
        public decimal Capex { get; set; }

        /// <summary>
        /// Налог на прибыль уплаченный
        /// </summary>
        [Column(TypeName = "decimal(18, 2)")]
        public decimal IncomeTaxPaid { get; set; }


        public decimal EBITDA
        {
            get { return this.OperatingIncome + this.Amortization; }
        }

        /// <summary>
        /// Free Cash Flow
        /// </summary>
        public decimal FCF
        {
            get { return this.EBITDA - this.IncomeTaxPaid - this.Capex + this.NWC; }
        }

        [Column(TypeName = "decimal(18, 2)")]
        public decimal FlowInvestingActivities { get; set; }

        [Column(TypeName = "decimal(18, 2)")]
        public decimal FlowFinancingActivities { get; set; }

        /// <summary>
        /// Средства направленные на продажу (выкуп) собственых акций
        /// </summary>
        [Column(TypeName = "decimal(18, 2)")]
        public decimal StockIssuance { get; set; }

        /// <summary>
        /// Дивиденды, выплаченные по акциям Компании
        /// </summary>
        [Column(TypeName = "decimal(18, 2)")]
        public decimal DividendsPaid { get; set; }

        /// <summary>
        /// Прибыль на акцию
        /// </summary>
        [Column(TypeName = "decimal(18, 2)")]
        public decimal EarningsPerShare { get; set; }

        /// <summary>
        /// Цена за акцию
        /// </summary>
        [Column(TypeName = "decimal(18, 2)")]
        public decimal Price { get; set; }

        /// <summary>
        /// P/E Ratio 
        /// </summary>
        public decimal PriceEarningsRatio
        {
            get { return Math.Round(Price / EarningsPerShare, 2); }
        }

        [Column(TypeName = "decimal(18, 2)")]
        public decimal ReturnOnEquity
        {
            get { return Math.Round(this.NetIncome / this.Equity * 100, 2); }
        }

        public int EmitentId { get; set; }
        public Emitent Emitent { get; set; }
    }
}
