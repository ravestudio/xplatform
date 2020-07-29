﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using xplatform.DataAccess;

namespace xplatform.Migrations
{
    [DbContext(typeof(XContext))]
    [Migration("20200729171050_DealBoard")]
    partial class DealBoard
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn)
                .HasAnnotation("ProductVersion", "3.1.1")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            modelBuilder.Entity("CommonLib.Objects.Account", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("Id")
                        .HasColumnType("integer")
                        .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

                    b.Property<string>("Name")
                        .HasColumnName("Name")
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("AccountSet");
                });

            modelBuilder.Entity("CommonLib.Objects.Deal", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("Id")
                        .HasColumnType("integer")
                        .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

                    b.Property<string>("Board")
                        .HasColumnName("Board")
                        .HasColumnType("text");

                    b.Property<int>("Count")
                        .HasColumnName("Count")
                        .HasColumnType("integer");

                    b.Property<DateTime>("Date")
                        .HasColumnName("Date")
                        .HasColumnType("timestamp without time zone");

                    b.Property<DateTime>("DeliveryDate")
                        .HasColumnName("DeliveryDate")
                        .HasColumnType("timestamp without time zone");

                    b.Property<decimal?>("NKD")
                        .HasColumnType("numeric");

                    b.Property<decimal>("Number")
                        .HasColumnName("Number")
                        .HasColumnType("numeric");

                    b.Property<byte>("Operation")
                        .HasColumnName("Operation")
                        .HasColumnType("smallint");

                    b.Property<decimal>("Price")
                        .HasColumnName("Price")
                        .HasColumnType("numeric");

                    b.Property<decimal>("Volume")
                        .HasColumnName("Volume")
                        .HasColumnType("numeric");

                    b.Property<int>("accountId")
                        .HasColumnType("integer");

                    b.Property<int>("securityId")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("accountId");

                    b.HasIndex("securityId");

                    b.ToTable("DealSet");
                });

            modelBuilder.Entity("CommonLib.Objects.Emitent", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("Id")
                        .HasColumnType("integer")
                        .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

                    b.Property<string>("Code")
                        .HasColumnName("Code")
                        .HasColumnType("text");

                    b.Property<string>("Description")
                        .HasColumnName("Description")
                        .HasColumnType("text");

                    b.Property<string>("FinancialPage")
                        .HasColumnName("FinancialPage")
                        .HasColumnType("text");

                    b.Property<string>("Name")
                        .HasColumnName("Name")
                        .HasColumnType("text");

                    b.Property<string>("WebSite")
                        .HasColumnName("WebSite")
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("EmitentSet");
                });

            modelBuilder.Entity("CommonLib.Objects.FinanceAnnual", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("Id")
                        .HasColumnType("uuid");

                    b.Property<string>("Code")
                        .IsRequired()
                        .HasColumnName("Code")
                        .HasColumnType("text");

                    b.Property<DateTime>("CreateDate")
                        .HasColumnName("CreateDate")
                        .HasColumnType("timestamp without time zone");

                    b.Property<string>("Data")
                        .IsRequired()
                        .HasColumnName("Data")
                        .HasColumnType("text");

                    b.Property<int>("Year")
                        .HasColumnName("Year")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.ToTable("FinanceAnnualSet");
                });

            modelBuilder.Entity("CommonLib.Objects.Financial", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("Id")
                        .HasColumnType("integer")
                        .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

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

                    b.Property<int>("EmitentId")
                        .HasColumnType("integer");

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
                        .HasColumnName("Period")
                        .HasColumnType("integer");

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
                        .HasColumnName("Year")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("EmitentId");

                    b.ToTable("FinancialSet");
                });

            modelBuilder.Entity("CommonLib.Objects.Position", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("Id")
                        .HasColumnType("integer")
                        .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

                    b.Property<int>("Limit")
                        .HasColumnName("Limit")
                        .HasColumnType("integer");

                    b.Property<DateTime>("OpenDate")
                        .HasColumnName("OpenDate")
                        .HasColumnType("timestamp without time zone");

                    b.Property<int>("accountId")
                        .HasColumnType("integer");

                    b.Property<int>("securityId")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("accountId");

                    b.HasIndex("securityId");

                    b.ToTable("PositionSet");
                });

            modelBuilder.Entity("CommonLib.Objects.Quote", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("Id")
                        .HasColumnType("uuid");

                    b.Property<string>("Board")
                        .HasColumnName("Board")
                        .HasColumnType("text");

                    b.Property<decimal?>("NKD")
                        .HasColumnName("NKD")
                        .HasColumnType("numeric");

                    b.Property<decimal>("change")
                        .HasColumnName("Change")
                        .HasColumnType("numeric");

                    b.Property<string>("figi")
                        .HasColumnName("Figi")
                        .HasColumnType("text");

                    b.Property<DateTime?>("lastUpdate")
                        .HasColumnName("LastUpdate")
                        .HasColumnType("timestamp without time zone");

                    b.Property<decimal>("open")
                        .HasColumnName("Open")
                        .HasColumnType("numeric");

                    b.Property<decimal>("previousClose")
                        .HasColumnName("PreviousClose")
                        .HasColumnType("numeric");

                    b.Property<decimal>("price")
                        .HasColumnName("Price")
                        .HasColumnType("numeric");

                    b.Property<string>("symbol")
                        .HasColumnName("Symbol")
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("QuoteSet");
                });

            modelBuilder.Entity("CommonLib.Objects.Security", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("Id")
                        .HasColumnType("integer")
                        .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

                    b.Property<string>("Board")
                        .HasColumnName("Board")
                        .HasColumnType("text");

                    b.Property<string>("Code")
                        .HasColumnName("Code")
                        .HasColumnType("text");

                    b.Property<string>("Currency")
                        .HasColumnName("Currency")
                        .HasColumnType("text");

                    b.Property<int?>("EmitentId")
                        .HasColumnType("integer");

                    b.Property<string>("Market")
                        .HasColumnName("Market")
                        .HasColumnType("text");

                    b.Property<string>("Name")
                        .HasColumnName("Name")
                        .HasColumnType("text");

                    b.Property<string>("Region")
                        .HasColumnName("Region")
                        .HasColumnType("text");

                    b.Property<string>("Type")
                        .IsRequired()
                        .HasColumnName("Type")
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("EmitentId");

                    b.ToTable("SecuritySet");

                    b.HasDiscriminator<string>("Type").HasValue("Security");
                });

            modelBuilder.Entity("CommonLib.Objects.SnapshootData", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("Id")
                        .HasColumnType("uuid");

                    b.Property<DateTime>("ChangeDate")
                        .HasColumnName("ChangeDate")
                        .HasColumnType("timestamp without time zone");

                    b.Property<string>("Data")
                        .HasColumnName("Data")
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("SnapshootSet");
                });

            modelBuilder.Entity("CommonLib.Objects.YahooFinanceRaw", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("Id")
                        .HasColumnType("uuid");

                    b.Property<string>("Code")
                        .IsRequired()
                        .HasColumnName("Code")
                        .HasColumnType("text");

                    b.Property<string>("Data")
                        .IsRequired()
                        .HasColumnName("Data")
                        .HasColumnType("text");

                    b.Property<DateTime>("LastFinance")
                        .HasColumnName("LastFinance")
                        .HasColumnType("timestamp without time zone");

                    b.Property<DateTime>("LoadDate")
                        .HasColumnName("LoadDate")
                        .HasColumnType("timestamp without time zone");

                    b.Property<bool>("Processed")
                        .HasColumnName("Processed")
                        .HasColumnType("boolean");

                    b.HasKey("Id");

                    b.ToTable("YahooFinanceRawSet");
                });

            modelBuilder.Entity("CommonLib.Objects.Bond", b =>
                {
                    b.HasBaseType("CommonLib.Objects.Security");

                    b.Property<decimal>("NominalPrice")
                        .HasColumnName("NominalPrice")
                        .HasColumnType("numeric");

                    b.HasDiscriminator().HasValue("bond");
                });

            modelBuilder.Entity("CommonLib.Objects.Currency", b =>
                {
                    b.HasBaseType("CommonLib.Objects.Security");

                    b.HasDiscriminator().HasValue("currency");
                });

            modelBuilder.Entity("CommonLib.Objects.ETF", b =>
                {
                    b.HasBaseType("CommonLib.Objects.Security");

                    b.Property<string>("Structure")
                        .IsRequired()
                        .HasColumnName("Structure")
                        .HasColumnType("text");

                    b.HasDiscriminator().HasValue("etf");
                });

            modelBuilder.Entity("CommonLib.Objects.Share", b =>
                {
                    b.HasBaseType("CommonLib.Objects.Security");

                    b.HasDiscriminator().HasValue("stock");
                });

            modelBuilder.Entity("CommonLib.Objects.Deal", b =>
                {
                    b.HasOne("CommonLib.Objects.Account", "Account")
                        .WithMany("Deals")
                        .HasForeignKey("accountId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("CommonLib.Objects.Security", "security")
                        .WithMany("Deals")
                        .HasForeignKey("securityId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("CommonLib.Objects.Financial", b =>
                {
                    b.HasOne("CommonLib.Objects.Emitent", "Emitent")
                        .WithMany("Financials")
                        .HasForeignKey("EmitentId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("CommonLib.Objects.Position", b =>
                {
                    b.HasOne("CommonLib.Objects.Account", "Account")
                        .WithMany("Positions")
                        .HasForeignKey("accountId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("CommonLib.Objects.Security", "Security")
                        .WithMany("Positions")
                        .HasForeignKey("securityId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("CommonLib.Objects.Security", b =>
                {
                    b.HasOne("CommonLib.Objects.Emitent", "Emitent")
                        .WithMany("Securities")
                        .HasForeignKey("EmitentId");
                });
#pragma warning restore 612, 618
        }
    }
}
