﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using xplatform.DataAccess;

namespace xplatform.Migrations
{
    [DbContext(typeof(XContext))]
    partial class XContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn)
                .HasAnnotation("ProductVersion", "2.2.6-servicing-10079")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            modelBuilder.Entity("CommonLib.Objects.Account", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("Id");

                    b.Property<string>("Name")
                        .HasColumnName("Name");

                    b.HasKey("Id");

                    b.ToTable("AccountSet");
                });

            modelBuilder.Entity("CommonLib.Objects.Deal", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("Id");

                    b.Property<int>("Count")
                        .HasColumnName("Count");

                    b.Property<DateTime>("Date")
                        .HasColumnName("Date");

                    b.Property<DateTime>("DeliveryDate")
                        .HasColumnName("DeliveryDate");

                    b.Property<decimal>("Number")
                        .HasColumnName("Number");

                    b.Property<byte>("Operation")
                        .HasColumnName("Operation");

                    b.Property<decimal>("Price")
                        .HasColumnName("Price");

                    b.Property<decimal>("Volume")
                        .HasColumnName("Volume");

                    b.Property<int>("accountId");

                    b.Property<int>("securityId");

                    b.HasKey("Id");

                    b.HasIndex("accountId");

                    b.HasIndex("securityId");

                    b.ToTable("DealSet");
                });

            modelBuilder.Entity("CommonLib.Objects.Emitent", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("Id");

                    b.Property<string>("Description")
                        .HasColumnName("Description");

                    b.Property<string>("Name")
                        .HasColumnName("Name");

                    b.Property<string>("WebSite")
                        .HasColumnName("WebSite");

                    b.HasKey("Id");

                    b.ToTable("EmitentSet");
                });

            modelBuilder.Entity("CommonLib.Objects.Financial", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("Id");

                    b.Property<decimal>("Amortization")
                        .HasColumnType("decimal(18, 2)");

                    b.Property<decimal>("Capex")
                        .HasColumnType("decimal(18, 2)");

                    b.Property<decimal>("CurrentAssets")
                        .HasColumnName("CurrentAssets")
                        .HasColumnType("decimal(18, 2)");

                    b.Property<decimal>("CurrentLiabilities")
                        .HasColumnName("CurrentLiabilities")
                        .HasColumnType("decimal(18, 2)");

                    b.Property<decimal>("DividendsPaid")
                        .HasColumnName("DividendsPaid")
                        .HasColumnType("decimal(18, 2)");

                    b.Property<decimal>("EarningsPerShare")
                        .HasColumnName("EarningsPerShare")
                        .HasColumnType("decimal(18, 2)");

                    b.Property<int>("EmitentId");

                    b.Property<decimal>("FixedAssets")
                        .HasColumnName("FixedAssets")
                        .HasColumnType("decimal(18, 2)");

                    b.Property<decimal>("FlowFinancingActivities")
                        .HasColumnName("FlowFinancingActivities")
                        .HasColumnType("decimal(18, 2)");

                    b.Property<decimal>("FlowInvestingActivities")
                        .HasColumnName("FlowInvestingActivities")
                        .HasColumnType("decimal(18, 2)");

                    b.Property<decimal>("FlowOperatingActivities")
                        .HasColumnName("FlowOperatingActivities")
                        .HasColumnType("decimal(18, 2)");

                    b.Property<decimal>("IncomeTaxPaid")
                        .HasColumnName("IncomeTaxPaid")
                        .HasColumnType("decimal(18, 2)");

                    b.Property<decimal>("LongTermLiabilities")
                        .HasColumnName("LongTermLiabilities")
                        .HasColumnType("decimal(18, 2)");

                    b.Property<decimal>("NWC")
                        .HasColumnName("NWC")
                        .HasColumnType("decimal(18, 2)");

                    b.Property<decimal>("NetIncome")
                        .HasColumnName("NetIncome")
                        .HasColumnType("decimal(18, 2)");

                    b.Property<decimal>("OperatingIncome")
                        .HasColumnName("OperatingIncome")
                        .HasColumnType("decimal(18, 2)");

                    b.Property<int>("Period")
                        .HasColumnName("Period");

                    b.Property<decimal>("Price")
                        .HasColumnName("Price")
                        .HasColumnType("decimal(18, 2)");

                    b.Property<decimal>("Revenue")
                        .HasColumnName("Revenue")
                        .HasColumnType("decimal(18, 2)");

                    b.Property<decimal>("StockIssuance")
                        .HasColumnName("StockIssuance")
                        .HasColumnType("decimal(18, 2)");

                    b.Property<int>("Year")
                        .HasColumnName("Year");

                    b.HasKey("Id");

                    b.HasIndex("EmitentId");

                    b.ToTable("FinancialSet");
                });

            modelBuilder.Entity("CommonLib.Objects.Position", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("Id");

                    b.Property<int>("Limit")
                        .HasColumnName("Limit");

                    b.Property<DateTime>("OpenDate")
                        .HasColumnName("OpenDate");

                    b.Property<int>("accountId");

                    b.Property<int>("securityId");

                    b.HasKey("Id");

                    b.HasIndex("accountId");

                    b.HasIndex("securityId");

                    b.ToTable("PositionSet");
                });

            modelBuilder.Entity("CommonLib.Objects.Security", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("Id");

                    b.Property<string>("Code")
                        .HasColumnName("Code");

                    b.Property<int>("EmitentId");

                    b.Property<string>("Name")
                        .HasColumnName("Name");

                    b.HasKey("Id");

                    b.HasIndex("EmitentId");

                    b.ToTable("SecuritySet");
                });

            modelBuilder.Entity("CommonLib.Objects.Deal", b =>
                {
                    b.HasOne("CommonLib.Objects.Account", "Account")
                        .WithMany("Deals")
                        .HasForeignKey("accountId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("CommonLib.Objects.Security", "security")
                        .WithMany("Deals")
                        .HasForeignKey("securityId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("CommonLib.Objects.Financial", b =>
                {
                    b.HasOne("CommonLib.Objects.Emitent", "Emitent")
                        .WithMany("Financials")
                        .HasForeignKey("EmitentId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("CommonLib.Objects.Position", b =>
                {
                    b.HasOne("CommonLib.Objects.Account", "Account")
                        .WithMany("Positions")
                        .HasForeignKey("accountId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("CommonLib.Objects.Security", "Security")
                        .WithMany("Positions")
                        .HasForeignKey("securityId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("CommonLib.Objects.Security", b =>
                {
                    b.HasOne("CommonLib.Objects.Emitent", "Emitent")
                        .WithMany("Securities")
                        .HasForeignKey("EmitentId")
                        .OnDelete(DeleteBehavior.Cascade);
                });
#pragma warning restore 612, 618
        }
    }
}
