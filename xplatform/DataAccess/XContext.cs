using CommonLib.Objects;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace xplatform.DataAccess
{
    public class XContext: DbContext
    {
        public DbSet<Emitent> EmitentSet { get; set; }
        public DbSet<Financial> FinancialSet { get; set; }
        public DbSet<Security> SecuritySet { get; set; }
        public DbSet<Deal> DealSet { get; set; }
        public DbSet<Account> AccountSet { get; set; }
        public DbSet<SnapshootData> SnapshootSet { get; set; }
        public XContext(DbContextOptions<XContext> options) : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Account>().HasKey(a => a.Id);
            modelBuilder.Entity<Account>().Property(a => a.Id).HasColumnName("Id");
            modelBuilder.Entity<Account>().Property(a => a.Name).HasColumnName("Name");
            modelBuilder.Entity<Account>().ToTable("AccountSet");

            modelBuilder.Entity<Emitent>().HasKey(e => e.Id);
            modelBuilder.Entity<Emitent>().Property(e => e.Id).HasColumnName("Id");
            modelBuilder.Entity<Emitent>().Property(e => e.Name).HasColumnName("Name");
            modelBuilder.Entity<Emitent>().Property(e => e.Code).HasColumnName("Code");
            modelBuilder.Entity<Emitent>().Property(e => e.Description).HasColumnName("Description");
            modelBuilder.Entity<Emitent>().Property(e => e.WebSite).HasColumnName("WebSite");
            modelBuilder.Entity<Emitent>().ToTable("EmitentSet");

            modelBuilder.Entity<Security>().HasKey(s => s.Id);
            modelBuilder.Entity<Security>().Property(s => s.Id).HasColumnName("Id");
            modelBuilder.Entity<Security>().Property(s => s.Name).HasColumnName("Name");
            modelBuilder.Entity<Security>().Property(s => s.Code).HasColumnName("Code");
            modelBuilder.Entity<Security>().HasOne(s => s.Emitent).WithMany(e => e.Securities).HasForeignKey(s => s.EmitentId);
            modelBuilder.Entity<Security>().Property(s => s.NominalPrice).HasColumnName("NominalPrice").IsRequired(false);
            modelBuilder.Entity<Security>().Property(s => s.Market).HasColumnName("Market");
            modelBuilder.Entity<Security>().Property(s => s.Board).HasColumnName("Board");
            modelBuilder.Entity<Security>().ToTable("SecuritySet");

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

            base.OnModelCreating(modelBuilder);
        }
    }
}
