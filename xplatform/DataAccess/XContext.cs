using CommonLib.ModelBuilder;
using CommonLib.Objects;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace xplatform.DataAccess
{
    public class XContext : DbContext
    {
        public DbSet<Emitent> EmitentSet { get; set; }
        public DbSet<Financial> FinancialSet { get; set; }
        public DbSet<Security> SecuritySet { get; set; }

        public DbSet<Share> ShareSet { get; set; }
        public DbSet<Bond> BondSet { get; set; }
        public DbSet<ETF> ETFSet { get; set; }
        public DbSet<Deal> DealSet { get; set; }
        public DbSet<Account> AccountSet { get; set; }

        public DbSet<Portfolio> PortfolioSet { get; set; }
        public DbSet<SnapshootData> SnapshootSet { get; set; }
        public DbSet<ProductData> ProductSet { get; set; }

        public DbSet<YahooFinanceRaw> YahooFinanceRawSet { get; set; }

        public DbSet<FinanceAnnual> FinanceAnnualSet { get; set; }

        public DbSet<Quote> QuoteSet { get; set; }

        public DbSet<DealRaw> DealRawSet { get; set; }
        public DbSet<MarketRaw> MarketRawSet { get; set; }
        public DbSet<SecurityRaw> SecurityRawSet { get; set; }
        public DbSet<MarketIndex> MarketIndexSet { get; set; }
        public DbSet<MarketIndexComponent> MarketIndexComponentSet { get; set; }
        public DbSet<MarketIndexChanges> MarketIndexChangesSet { get; set; }

        public DbSet<Note> NoteSet { get; set; }
        public XContext(DbContextOptions<XContext> options) : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            ContextModelBuilder.Build(modelBuilder);

            base.OnModelCreating(modelBuilder);
        }
    }
}
