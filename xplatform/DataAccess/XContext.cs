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
        public XContext(DbContextOptions<XContext> options) : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Emitent>().HasKey(e => e.Id);
            modelBuilder.Entity<Emitent>().Property(e => e.Id).HasColumnName("Id");
            modelBuilder.Entity<Emitent>().Property(e => e.Name).HasColumnName("Name");
            modelBuilder.Entity<Emitent>().Property(e => e.Description).HasColumnName("Description");
            modelBuilder.Entity<Emitent>().Property(e => e.WebSite).HasColumnName("WebSite");
            modelBuilder.Entity<Emitent>().ToTable("EmitentSet");

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
            modelBuilder.Entity<Financial>().ToTable("FinancialSet");

            base.OnModelCreating(modelBuilder);
        }
    }
}
