using CommonLib.ModelBuilder;
using CommonLib.Objects;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace migrationUtils.DataAccess
{
    public class XContext : DbContext
    {
        private readonly string _connection;
        public XContext(string connectionString) {
            _connection = connectionString;
        }

        public DbSet<FinanceAnnual> FinanceAnnualSet { get; set; }
        public DbSet<DealRaw> DealRawSet { get; set; }
        public DbSet<Quote> QuoteSet { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseNpgsql(_connection);

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            ContextModelBuilder.Build(modelBuilder);

            base.OnModelCreating(modelBuilder);
        }
    }
}
