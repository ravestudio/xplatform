using CommonLib.Objects;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CommonLib.ModelBuilder
{
    public class ContextModelBuilder
    {
        public static void Build(Microsoft.EntityFrameworkCore.ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Account>().HasKey(a => a.Id);
            modelBuilder.Entity<Account>().Property(a => a.Id).HasColumnName("Id");
            modelBuilder.Entity<Account>().Property(a => a.Name).HasColumnName("Name");
            modelBuilder.Entity<Account>().Property(a => a.Client).HasColumnName("Client");
            modelBuilder.Entity<Account>().Property(a => a.Cash).HasColumnName("Cash");
            modelBuilder.Entity<Account>().ToTable("AccountSet");

            modelBuilder.Entity<Portfolio>().HasKey(a => a.Id);
            modelBuilder.Entity<Portfolio>().Property(a => a.Id).HasColumnName("Id");
            modelBuilder.Entity<Portfolio>().Property(a => a.Name).HasColumnName("Name");
            modelBuilder.Entity<Portfolio>().ToTable("PortfolioSet");

            modelBuilder.Entity<PortfolioAccounts>().HasKey(pa => new { pa.AccountId, pa.PortfolioId });

            modelBuilder.Entity<PortfolioAccounts>().HasOne(pa => pa.Account)
                .WithMany(a => a.PortfolioAccounts)
                .HasForeignKey(pa => pa.AccountId);

            modelBuilder.Entity<PortfolioAccounts>().HasOne(pa => pa.Portfolio)
                .WithMany(p => p.PortfolioAccounts)
                .HasForeignKey(pa => pa.PortfolioId);

            modelBuilder.Entity<Emitent>().HasKey(e => e.Id);
            modelBuilder.Entity<Emitent>().Property(e => e.Id).HasColumnName("Id");
            modelBuilder.Entity<Emitent>().Property(e => e.Name).HasColumnName("Name");
            modelBuilder.Entity<Emitent>().Property(e => e.Code).HasColumnName("Code");
            modelBuilder.Entity<Emitent>().Property(e => e.Description).HasColumnName("Description");
            modelBuilder.Entity<Emitent>().Property(e => e.WebSite).HasColumnName("WebSite");
            modelBuilder.Entity<Emitent>().Property(e => e.FinancialPage).HasColumnName("FinancialPage");
            modelBuilder.Entity<Emitent>().ToTable("EmitentSet");

            modelBuilder.Entity<Note>().HasKey(n => n.Id);
            modelBuilder.Entity<Note>().Property(n => n.Id).HasColumnName("Id");
            modelBuilder.Entity<Note>().HasOne(n => n.Emitent).WithMany(e => e.Notes).HasForeignKey(n => n.EmitentId);
            modelBuilder.Entity<Note>().Property(n => n.ChangeDate).HasColumnName("ChangeDate");
            modelBuilder.Entity<Note>().Property(n => n.Data).HasColumnName("Data");
            modelBuilder.Entity<Note>().ToTable("NoteSet");

            /*modelBuilder.Entity<EmitentProfile>().HasKey(y => y.Id);
            modelBuilder.Entity<EmitentProfile>().Property(y => y.Id).HasColumnName("Id");*/
            modelBuilder.Entity<EmitentProfile>().HasKey(y => y.EmitentId);
            modelBuilder.Entity<EmitentProfile>().Property(y => y.EmitentId).HasColumnName("EmitentId");
            modelBuilder.Entity<EmitentProfile>().HasOne(s => s.Emitent).WithOne(e => e.EmitentProfile).HasForeignKey<EmitentProfile>(p => p.EmitentId);
            modelBuilder.Entity<EmitentProfile>().Property(y => y.Data).HasColumnName("Data").IsRequired();
            modelBuilder.Entity<EmitentProfile>().Property(y => y.CreateDate).HasColumnName("CreateDate").IsRequired();
            modelBuilder.Entity<EmitentProfile>().ToTable("EmitentProfileSet");

            modelBuilder.Entity<Security>().HasDiscriminator(s => s.Type)
                .HasValue<Share>("stock")
                .HasValue<Bond>("bond")
                .HasValue<ETF>("etf")
                .HasValue<Currency>("currency");

            modelBuilder.Entity<Security>().HasKey(s => s.Id);
            modelBuilder.Entity<Security>().Property(s => s.Id).HasColumnName("Id");
            modelBuilder.Entity<Security>().Property(s => s.ISIN).HasColumnName("ISIN");
            modelBuilder.Entity<Security>().Property(s => s.Name).HasColumnName("Name");
            modelBuilder.Entity<Security>().Property(s => s.Code).HasColumnName("Code");
            modelBuilder.Entity<Security>().Property(s => s.FinancialPage).HasColumnName("FinancialPage");
            modelBuilder.Entity<Security>().Property(s => s.Region).HasColumnName("Region");
            modelBuilder.Entity<Security>().Property(s => s.Currency).HasColumnName("Currency");
            modelBuilder.Entity<Security>().HasOne(s => s.Emitent).WithMany(e => e.Securities).HasForeignKey(s => s.EmitentId);
            modelBuilder.Entity<Security>().Property(s => s.Type).HasColumnName("Type");
            modelBuilder.Entity<Security>().Property(s => s.FinancialPage).HasColumnName("FinancialPage");
            modelBuilder.Entity<Security>().ToTable("SecuritySet");

            modelBuilder.Entity<SecurityStatistics>().HasKey(s => s.SecurityId);
            modelBuilder.Entity<SecurityStatistics>().Property(y => y.SecurityId).HasColumnName("SecurityId");
            modelBuilder.Entity<SecurityStatistics>().HasOne(s => s.Security).WithOne(e => e.SecurityStatistics).HasForeignKey<SecurityStatistics>(p => p.SecurityId);
            modelBuilder.Entity<SecurityStatistics>().Property(y => y.Data).HasColumnName("Data").IsRequired();
            modelBuilder.Entity<SecurityStatistics>().Property(y => y.CreateDate).HasColumnName("CreateDate").IsRequired();
            modelBuilder.Entity<SecurityStatistics>().ToTable("SecurityKeyStatisticsSet");

            modelBuilder.Entity<FinancialData>().HasKey(y => y.SecurityId);
            modelBuilder.Entity<FinancialData>().Property(y => y.SecurityId).HasColumnName("SecurityId");
            modelBuilder.Entity<FinancialData>().HasOne(s => s.Security).WithOne(e => e.FinancialData).HasForeignKey<FinancialData>(p => p.SecurityId);
            modelBuilder.Entity<FinancialData>().Property(y => y.Data).HasColumnName("Data").IsRequired();
            modelBuilder.Entity<FinancialData>().Property(y => y.CreateDate).HasColumnName("CreateDate").IsRequired();
            modelBuilder.Entity<FinancialData>().ToTable("FinancialDataSet");

            modelBuilder.Entity<Bond>().Property(s => s.NominalPrice).HasColumnName("NominalPrice");
            modelBuilder.Entity<Bond>().Property(s => s.NKDCurrency).HasColumnName("NKDCurrency");
            modelBuilder.Entity<ETF>().Property(s => s.Structure).HasColumnName("Structure").IsRequired();

            modelBuilder.Entity<Deal>().HasKey(d => d.Id);
            modelBuilder.Entity<Deal>().Property(d => d.Id).HasColumnName("Id");
            modelBuilder.Entity<Deal>().HasOne(d => d.Account).WithMany(a => a.Deals).HasForeignKey(d => d.accountId);
            modelBuilder.Entity<Deal>().Property(d => d.Number).HasColumnName("Number");
            modelBuilder.Entity<Deal>().Property(d => d.Operation).HasColumnName("Operation");
            modelBuilder.Entity<Deal>().Property(d => d.Date).HasColumnName("Date");
            modelBuilder.Entity<Deal>().Property(d => d.DeliveryDate).HasColumnName("DeliveryDate");
            modelBuilder.Entity<Deal>().Property(d => d.Price).HasColumnName("Price");
            modelBuilder.Entity<Deal>().Property(d => d.Count).HasColumnName("Count");
            modelBuilder.Entity<Deal>().Property(d => d.Volume).HasColumnName("Volume");
            modelBuilder.Entity<Deal>().HasOne(d => d.security).WithMany(s => s.Deals).HasForeignKey(d => d.securityId);
            modelBuilder.Entity<Deal>().Property(d => d.Board).HasColumnName("Board");
            modelBuilder.Entity<Deal>().Property(d => d.Locked).HasColumnName("Locked");
            modelBuilder.Entity<Deal>().ToTable("DealSet");

            modelBuilder.Entity<Position>().HasKey(p => p.Id);
            modelBuilder.Entity<Position>().Property(p => p.Id).HasColumnName("Id");
            modelBuilder.Entity<Position>().Property(p => p.OpenDate).HasColumnName("OpenDate");
            modelBuilder.Entity<Position>().HasOne(p => p.Security).WithMany(s => s.Positions).HasForeignKey(p => p.securityId);
            modelBuilder.Entity<Position>().HasOne(p => p.Account).WithMany(a => a.Positions).HasForeignKey(p => p.accountId);
            modelBuilder.Entity<Position>().Property(p => p.Limit).HasColumnName("Limit");
            modelBuilder.Entity<Position>().ToTable("PositionSet");

            modelBuilder.Entity<Financial>().HasKey(f => f.Id);
            modelBuilder.Entity<Financial>().Property(f => f.Id).HasColumnName("Id");
            modelBuilder.Entity<Financial>().Property(f => f.Year).HasColumnName("Year").IsRequired();
            modelBuilder.Entity<Financial>().Property(f => f.Period).HasColumnName("Period").IsRequired();

            modelBuilder.Entity<Financial>().Property(f => f.Revenue).HasColumnName("Revenue").IsRequired();
            modelBuilder.Entity<Financial>().Property(f => f.OperatingIncome).HasColumnName("OperatingIncome").IsRequired();
            modelBuilder.Entity<Financial>().Property(f => f.NetIncome).HasColumnName("NetIncome").IsRequired();

            modelBuilder.Entity<Financial>().Property(f => f.CurrentAssets).HasColumnName("CurrentAssets").IsRequired();
            modelBuilder.Entity<Financial>().Property(f => f.FixedAssets).HasColumnName("FixedAssets").IsRequired();

            modelBuilder.Entity<Financial>().Property(f => f.CurrentLiabilities).HasColumnName("CurrentLiabilities").IsRequired();
            modelBuilder.Entity<Financial>().Property(f => f.LongTermLiabilities).HasColumnName("LongTermLiabilities").IsRequired();

            modelBuilder.Entity<Financial>().Property(f => f.FlowOperatingActivities).HasColumnName("FlowOperatingActivities").IsRequired();
            modelBuilder.Entity<Financial>().Property(f => f.NWC).HasColumnName("NWC").IsRequired();
            modelBuilder.Entity<Financial>().Property(f => f.IncomeTaxPaid).HasColumnName("IncomeTaxPaid").IsRequired();

            modelBuilder.Entity<Financial>().Property(f => f.FlowInvestingActivities).HasColumnName("FlowInvestingActivities").IsRequired();
            modelBuilder.Entity<Financial>().Property(f => f.FlowFinancingActivities).HasColumnName("FlowFinancingActivities").IsRequired();

            modelBuilder.Entity<Financial>().Property(f => f.StockIssuance).HasColumnName("StockIssuance").IsRequired();
            modelBuilder.Entity<Financial>().Property(f => f.DividendsPaid).HasColumnName("DividendsPaid").IsRequired();
            modelBuilder.Entity<Financial>().Property(f => f.EarningsPerShare).HasColumnName("EarningsPerShare").IsRequired();

            modelBuilder.Entity<Financial>().Property(f => f.Price).HasColumnName("Price").IsRequired();

            modelBuilder.Entity<Financial>().HasOne(f => f.Emitent).WithMany(e => e.Financials).HasForeignKey(f => f.EmitentId);
            modelBuilder.Entity<Financial>().Ignore(f => f.EmitentCode);
            modelBuilder.Entity<Financial>().ToTable("FinancialSet");

            modelBuilder.Entity<SnapshootData>().HasKey(p => p.Id);
            modelBuilder.Entity<SnapshootData>().Property(p => p.Id).HasColumnName("Id");
            modelBuilder.Entity<SnapshootData>().Property(p => p.ChangeDate).HasColumnName("ChangeDate");
            modelBuilder.Entity<SnapshootData>().Property(p => p.Data).HasColumnName("Data");
            modelBuilder.Entity<SnapshootData>().ToTable("SnapshootSet");

            modelBuilder.Entity<ProductData>().HasKey(p => p.Id);
            modelBuilder.Entity<ProductData>().Property(p => p.Id).HasColumnName("Id");
            modelBuilder.Entity<ProductData>().Property(p => p.ChangeDate).HasColumnName("ChangeDate");
            modelBuilder.Entity<ProductData>().Property(p => p.Data).HasColumnName("Data");
            modelBuilder.Entity<ProductData>().ToTable("ProductSet");

            modelBuilder.Entity<YahooFinanceRaw>().HasKey(y => y.Id);
            modelBuilder.Entity<YahooFinanceRaw>().Property(y => y.Id).HasColumnName("Id");
            modelBuilder.Entity<YahooFinanceRaw>().Property(y => y.Code).HasColumnName("Code").IsRequired();
            modelBuilder.Entity<YahooFinanceRaw>().Property(y => y.Data).HasColumnName("Data");
            modelBuilder.Entity<YahooFinanceRaw>().Property(y => y.LoadDate).HasColumnName("LoadDate");
            modelBuilder.Entity<YahooFinanceRaw>().Property(y => y.LastFinance).HasColumnName("LastFinance");
            modelBuilder.Entity<YahooFinanceRaw>().Property(y => y.Status).HasColumnName("Status");
            modelBuilder.Entity<YahooFinanceRaw>().ToTable("YahooFinanceRawSet");

            modelBuilder.Entity<FinanceAnnual>().HasKey(y => y.Id);
            modelBuilder.Entity<FinanceAnnual>().Property(y => y.Id).HasColumnName("Id");
            modelBuilder.Entity<FinanceAnnual>().Property(y => y.Code).HasColumnName("Code").IsRequired();
            modelBuilder.Entity<FinanceAnnual>().Property(y => y.Data).HasColumnName("Data").IsRequired();
            modelBuilder.Entity<FinanceAnnual>().Property(y => y.Year).HasColumnName("Year").IsRequired();
            modelBuilder.Entity<FinanceAnnual>().Property(y => y.CreateDate).HasColumnName("CreateDate").IsRequired();
            modelBuilder.Entity<FinanceAnnual>().ToTable("FinanceAnnualSet");

            modelBuilder.Entity<Quote>().HasKey(q => q.Id);
            modelBuilder.Entity<Quote>().Property(q => q.Id).HasColumnName("Id");
            modelBuilder.Entity<Quote>().Property(q => q.figi).HasColumnName("Figi");
            modelBuilder.Entity<Quote>().Property(q => q.symbol).HasColumnName("Symbol");
            modelBuilder.Entity<Quote>().Property(q => q.lastUpdate).HasColumnName("LastUpdate");
            modelBuilder.Entity<Quote>().Property(q => q.open).HasColumnName("Open").IsRequired();
            modelBuilder.Entity<Quote>().Property(q => q.price).HasColumnName("Price").IsRequired();
            modelBuilder.Entity<Quote>().Property(q => q.NKD).HasColumnName("NKD");
            modelBuilder.Entity<Quote>().Property(q => q.previousClose).HasColumnName("PreviousClose").IsRequired();
            modelBuilder.Entity<Quote>().Property(q => q.change).HasColumnName("Change").IsRequired();
            modelBuilder.Entity<Quote>().Property(q => q.Board).HasColumnName("Board");
            modelBuilder.Entity<Quote>().ToTable("QuoteSet");

            modelBuilder.Entity<DealRaw>().HasKey(d => new { d.number, d.board });
            modelBuilder.Entity<DealRaw>().ToTable("deal_raw");

            modelBuilder.Entity<MarketRaw>().HasKey(m => new { m.symbol, m.board });
            modelBuilder.Entity<MarketRaw>().Property(m => m.lotSize).HasColumnName("lotsize");
            modelBuilder.Entity<MarketRaw>().ToTable("market_raw");

            modelBuilder.Entity<SecurityRaw>().HasKey(s => s.isin);
            modelBuilder.Entity<SecurityRaw>().ToTable("security_raw");

            modelBuilder.Entity<MarketIndex>().HasKey(m => m.Id);
            modelBuilder.Entity<MarketIndex>().Property(m => m.Id).HasColumnName("Id");
            modelBuilder.Entity<MarketIndex>().Property(m => m.Name).HasColumnName("Name");
            modelBuilder.Entity<MarketIndex>().ToTable("MarketIndexSet");

            modelBuilder.Entity<MarketIndexComponent>().HasKey(mc => mc.Id);
            modelBuilder.Entity<MarketIndexComponent>().Property(mc => mc.Id).HasColumnName("Id");
            modelBuilder.Entity<MarketIndexComponent>().Property(mc => mc.Code).HasColumnName("Code").IsRequired();
            modelBuilder.Entity<MarketIndexComponent>().HasOne(mc => mc.MarketIndex).WithMany(m => m.Constituents).HasForeignKey(mc => mc.MarketIndexId);
            modelBuilder.Entity<MarketIndexComponent>().ToTable("MarketIndexComponentSet");

            modelBuilder.Entity<MarketIndexChanges>().HasKey(mc => mc.Id);
            modelBuilder.Entity<MarketIndexChanges>().Property(mc => mc.Id).HasColumnName("Id");
            modelBuilder.Entity<MarketIndexChanges>().Property(mc => mc.Date).HasColumnName("Date");
            modelBuilder.Entity<MarketIndexChanges>().Property(mc => mc.Data).HasColumnName("Data");
            modelBuilder.Entity<MarketIndexChanges>().HasOne(mc => mc.MarketIndex).WithMany(m => m.Changes).HasForeignKey(mc => mc.MarketIndexId);
            modelBuilder.Entity<MarketIndexChanges>().Property(mc => mc.Processed).HasColumnName("Processed");
            modelBuilder.Entity<MarketIndexChanges>().ToTable("MarketIndexChangesSet");
        }
    }
}
