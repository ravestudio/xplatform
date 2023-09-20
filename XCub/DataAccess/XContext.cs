using CommonLib.Objects;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace XCub.DataAccess
{
    public class XContext : DbContext
    {

        public DbSet<Quote> QuoteSet { get; set; }
        public XContext(DbContextOptions<XContext> options) : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

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

            

            base.OnModelCreating(modelBuilder);
        }
    }
}
