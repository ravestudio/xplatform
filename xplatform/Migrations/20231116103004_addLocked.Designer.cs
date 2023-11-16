﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using xplatform.DataAccess;

#nullable disable

namespace xplatform.Migrations
{
    [DbContext(typeof(XContext))]
    [Migration("20231116103004_addLocked")]
    partial class addLocked
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.10")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("CommonLib.Objects.Account", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasColumnName("Id");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("Cash")
                        .HasColumnType("text")
                        .HasColumnName("Cash");

                    b.Property<string>("Client")
                        .HasColumnType("text")
                        .HasColumnName("Client");

                    b.Property<string>("Name")
                        .HasColumnType("text")
                        .HasColumnName("Name");

                    b.HasKey("Id");

                    b.ToTable("AccountSet", (string)null);
                });

            modelBuilder.Entity("CommonLib.Objects.Deal", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasColumnName("Id");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("Board")
                        .HasColumnType("text")
                        .HasColumnName("Board");

                    b.Property<int>("Count")
                        .HasColumnType("integer")
                        .HasColumnName("Count");

                    b.Property<DateTime>("Date")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("Date");

                    b.Property<DateTime>("DeliveryDate")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("DeliveryDate");

                    b.Property<bool>("Locked")
                        .HasColumnType("boolean")
                        .HasColumnName("Locked");

                    b.Property<decimal?>("NKD")
                        .HasColumnType("numeric");

                    b.Property<decimal>("Number")
                        .HasColumnType("numeric")
                        .HasColumnName("Number");

                    b.Property<byte>("Operation")
                        .HasColumnType("smallint")
                        .HasColumnName("Operation");

                    b.Property<decimal>("Price")
                        .HasColumnType("numeric")
                        .HasColumnName("Price");

                    b.Property<decimal>("Volume")
                        .HasColumnType("numeric")
                        .HasColumnName("Volume");

                    b.Property<int>("accountId")
                        .HasColumnType("integer");

                    b.Property<int>("securityId")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("accountId");

                    b.HasIndex("securityId");

                    b.ToTable("DealSet", (string)null);
                });

            modelBuilder.Entity("CommonLib.Objects.DealRaw", b =>
                {
                    b.Property<decimal>("number")
                        .HasColumnType("numeric");

                    b.Property<string>("board")
                        .HasColumnType("text");

                    b.Property<string>("client")
                        .HasColumnType("text");

                    b.Property<int>("count")
                        .HasColumnType("integer");

                    b.Property<string>("date")
                        .HasColumnType("text");

                    b.Property<string>("delivery_date")
                        .HasColumnType("text");

                    b.Property<decimal?>("nkd")
                        .HasColumnType("numeric");

                    b.Property<string>("operation")
                        .HasColumnType("text");

                    b.Property<decimal>("price")
                        .HasColumnType("numeric");

                    b.Property<string>("symbol")
                        .HasColumnType("text");

                    b.Property<string>("time")
                        .HasColumnType("text");

                    b.Property<decimal>("volume")
                        .HasColumnType("numeric");

                    b.HasKey("number", "board");

                    b.ToTable("deal_raw", (string)null);
                });

            modelBuilder.Entity("CommonLib.Objects.Emitent", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasColumnName("Id");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("Code")
                        .HasColumnType("text")
                        .HasColumnName("Code");

                    b.Property<string>("Description")
                        .HasColumnType("text")
                        .HasColumnName("Description");

                    b.Property<string>("FinancialPage")
                        .HasColumnType("text")
                        .HasColumnName("FinancialPage");

                    b.Property<string>("Name")
                        .HasColumnType("text")
                        .HasColumnName("Name");

                    b.Property<string>("WebSite")
                        .HasColumnType("text")
                        .HasColumnName("WebSite");

                    b.HasKey("Id");

                    b.ToTable("EmitentSet", (string)null);
                });

            modelBuilder.Entity("CommonLib.Objects.EmitentProfile", b =>
                {
                    b.Property<int?>("EmitentId")
                        .HasColumnType("integer")
                        .HasColumnName("EmitentId");

                    b.Property<DateTime>("CreateDate")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("CreateDate");

                    b.Property<string>("Data")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("Data");

                    b.HasKey("EmitentId");

                    b.ToTable("EmitentProfileSet", (string)null);
                });

            modelBuilder.Entity("CommonLib.Objects.FinanceAnnual", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid")
                        .HasColumnName("Id");

                    b.Property<string>("Code")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("Code");

                    b.Property<DateTime>("CreateDate")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("CreateDate");

                    b.Property<string>("Data")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("Data");

                    b.Property<int>("Year")
                        .HasColumnType("integer")
                        .HasColumnName("Year");

                    b.HasKey("Id");

                    b.ToTable("FinanceAnnualSet", (string)null);
                });

            modelBuilder.Entity("CommonLib.Objects.Financial", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasColumnName("Id");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<decimal>("Amortization")
                        .HasColumnType("decimal(18, 2)");

                    b.Property<decimal>("Capex")
                        .HasColumnType("decimal(18, 2)");

                    b.Property<decimal>("CurrentAssets")
                        .HasColumnType("decimal(18, 2)")
                        .HasColumnName("CurrentAssets");

                    b.Property<decimal>("CurrentLiabilities")
                        .HasColumnType("decimal(18, 2)")
                        .HasColumnName("CurrentLiabilities");

                    b.Property<decimal>("DividendsPaid")
                        .HasColumnType("decimal(18, 2)")
                        .HasColumnName("DividendsPaid");

                    b.Property<decimal>("EarningsPerShare")
                        .HasColumnType("decimal(18, 2)")
                        .HasColumnName("EarningsPerShare");

                    b.Property<int>("EmitentId")
                        .HasColumnType("integer");

                    b.Property<decimal>("FixedAssets")
                        .HasColumnType("decimal(18, 2)")
                        .HasColumnName("FixedAssets");

                    b.Property<decimal>("FlowFinancingActivities")
                        .HasColumnType("decimal(18, 2)")
                        .HasColumnName("FlowFinancingActivities");

                    b.Property<decimal>("FlowInvestingActivities")
                        .HasColumnType("decimal(18, 2)")
                        .HasColumnName("FlowInvestingActivities");

                    b.Property<decimal>("FlowOperatingActivities")
                        .HasColumnType("decimal(18, 2)")
                        .HasColumnName("FlowOperatingActivities");

                    b.Property<decimal>("IncomeTaxPaid")
                        .HasColumnType("decimal(18, 2)")
                        .HasColumnName("IncomeTaxPaid");

                    b.Property<decimal>("LongTermLiabilities")
                        .HasColumnType("decimal(18, 2)")
                        .HasColumnName("LongTermLiabilities");

                    b.Property<decimal>("NWC")
                        .HasColumnType("decimal(18, 2)")
                        .HasColumnName("NWC");

                    b.Property<decimal>("NetIncome")
                        .HasColumnType("decimal(18, 2)")
                        .HasColumnName("NetIncome");

                    b.Property<decimal>("OperatingIncome")
                        .HasColumnType("decimal(18, 2)")
                        .HasColumnName("OperatingIncome");

                    b.Property<int>("Period")
                        .HasColumnType("integer")
                        .HasColumnName("Period");

                    b.Property<decimal>("Price")
                        .HasColumnType("decimal(18, 2)")
                        .HasColumnName("Price");

                    b.Property<decimal>("Revenue")
                        .HasColumnType("decimal(18, 2)")
                        .HasColumnName("Revenue");

                    b.Property<decimal>("StockIssuance")
                        .HasColumnType("decimal(18, 2)")
                        .HasColumnName("StockIssuance");

                    b.Property<int>("Year")
                        .HasColumnType("integer")
                        .HasColumnName("Year");

                    b.HasKey("Id");

                    b.HasIndex("EmitentId");

                    b.ToTable("FinancialSet", (string)null);
                });

            modelBuilder.Entity("CommonLib.Objects.FinancialData", b =>
                {
                    b.Property<int?>("SecurityId")
                        .HasColumnType("integer")
                        .HasColumnName("SecurityId");

                    b.Property<DateTime>("CreateDate")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("CreateDate");

                    b.Property<string>("Data")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("Data");

                    b.HasKey("SecurityId");

                    b.ToTable("FinancialDataSet", (string)null);
                });

            modelBuilder.Entity("CommonLib.Objects.MarketIndex", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid")
                        .HasColumnName("Id");

                    b.Property<string>("Name")
                        .HasColumnType("text")
                        .HasColumnName("Name");

                    b.HasKey("Id");

                    b.ToTable("MarketIndexSet", (string)null);
                });

            modelBuilder.Entity("CommonLib.Objects.MarketIndexChanges", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid")
                        .HasColumnName("Id");

                    b.Property<string>("Data")
                        .HasColumnType("text")
                        .HasColumnName("Data");

                    b.Property<DateTime>("Date")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("Date");

                    b.Property<Guid?>("MarketIndexId")
                        .HasColumnType("uuid");

                    b.Property<bool>("Processed")
                        .HasColumnType("boolean")
                        .HasColumnName("Processed");

                    b.HasKey("Id");

                    b.HasIndex("MarketIndexId");

                    b.ToTable("MarketIndexChangesSet", (string)null);
                });

            modelBuilder.Entity("CommonLib.Objects.MarketIndexComponent", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid")
                        .HasColumnName("Id");

                    b.Property<string>("Code")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("Code");

                    b.Property<Guid?>("MarketIndexId")
                        .HasColumnType("uuid");

                    b.HasKey("Id");

                    b.HasIndex("MarketIndexId");

                    b.ToTable("MarketIndexComponentSet", (string)null);
                });

            modelBuilder.Entity("CommonLib.Objects.MarketRaw", b =>
                {
                    b.Property<string>("symbol")
                        .HasColumnType("text");

                    b.Property<string>("board")
                        .HasColumnType("text");

                    b.Property<int>("lotSize")
                        .HasColumnType("integer")
                        .HasColumnName("lotsize");

                    b.Property<string>("name")
                        .HasColumnType("text");

                    b.HasKey("symbol", "board");

                    b.ToTable("market_raw", (string)null);
                });

            modelBuilder.Entity("CommonLib.Objects.Portfolio", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasColumnName("Id");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("Name")
                        .HasColumnType("text")
                        .HasColumnName("Name");

                    b.HasKey("Id");

                    b.ToTable("PortfolioSet", (string)null);
                });

            modelBuilder.Entity("CommonLib.Objects.PortfolioAccounts", b =>
                {
                    b.Property<int?>("AccountId")
                        .HasColumnType("integer");

                    b.Property<int?>("PortfolioId")
                        .HasColumnType("integer");

                    b.HasKey("AccountId", "PortfolioId");

                    b.HasIndex("PortfolioId");

                    b.ToTable("PortfolioAccounts");
                });

            modelBuilder.Entity("CommonLib.Objects.Position", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasColumnName("Id");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<int>("Limit")
                        .HasColumnType("integer")
                        .HasColumnName("Limit");

                    b.Property<DateTime>("OpenDate")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("OpenDate");

                    b.Property<int>("accountId")
                        .HasColumnType("integer");

                    b.Property<int>("securityId")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("accountId");

                    b.HasIndex("securityId");

                    b.ToTable("PositionSet", (string)null);
                });

            modelBuilder.Entity("CommonLib.Objects.Quote", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid")
                        .HasColumnName("Id");

                    b.Property<string>("Board")
                        .HasColumnType("text")
                        .HasColumnName("Board");

                    b.Property<decimal?>("NKD")
                        .HasColumnType("numeric")
                        .HasColumnName("NKD");

                    b.Property<decimal>("change")
                        .HasColumnType("numeric")
                        .HasColumnName("Change");

                    b.Property<string>("figi")
                        .HasColumnType("text")
                        .HasColumnName("Figi");

                    b.Property<DateTime?>("lastUpdate")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("LastUpdate");

                    b.Property<decimal>("open")
                        .HasColumnType("numeric")
                        .HasColumnName("Open");

                    b.Property<decimal>("previousClose")
                        .HasColumnType("numeric")
                        .HasColumnName("PreviousClose");

                    b.Property<decimal>("price")
                        .HasColumnType("numeric")
                        .HasColumnName("Price");

                    b.Property<string>("symbol")
                        .HasColumnType("text")
                        .HasColumnName("Symbol");

                    b.HasKey("Id");

                    b.ToTable("QuoteSet", (string)null);
                });

            modelBuilder.Entity("CommonLib.Objects.Security", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasColumnName("Id");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("Code")
                        .HasColumnType("text")
                        .HasColumnName("Code");

                    b.Property<string>("Currency")
                        .HasColumnType("text")
                        .HasColumnName("Currency");

                    b.Property<int?>("EmitentId")
                        .HasColumnType("integer");

                    b.Property<string>("FinancialPage")
                        .HasColumnType("text")
                        .HasColumnName("FinancialPage");

                    b.Property<string>("ISIN")
                        .HasColumnType("text")
                        .HasColumnName("ISIN");

                    b.Property<string>("Name")
                        .HasColumnType("text")
                        .HasColumnName("Name");

                    b.Property<string>("Region")
                        .HasColumnType("text")
                        .HasColumnName("Region");

                    b.Property<string>("Type")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("Type");

                    b.HasKey("Id");

                    b.HasIndex("EmitentId");

                    b.ToTable("SecuritySet", (string)null);

                    b.HasDiscriminator<string>("Type").HasValue("Security");

                    b.UseTphMappingStrategy();
                });

            modelBuilder.Entity("CommonLib.Objects.SecurityRaw", b =>
                {
                    b.Property<string>("isin")
                        .HasColumnType("text");

                    b.Property<string>("Board")
                        .HasColumnType("text");

                    b.Property<string>("Emitent")
                        .HasColumnType("text");

                    b.Property<bool>("Processed")
                        .HasColumnType("boolean");

                    b.Property<string>("currency")
                        .HasColumnType("text");

                    b.Property<string>("figi")
                        .HasColumnType("text");

                    b.Property<int>("lot")
                        .HasColumnType("integer");

                    b.Property<decimal>("minPriceIncrement")
                        .HasColumnType("numeric");

                    b.Property<string>("name")
                        .HasColumnType("text");

                    b.Property<string>("ticker")
                        .HasColumnType("text");

                    b.Property<string>("type")
                        .HasColumnType("text");

                    b.HasKey("isin");

                    b.ToTable("security_raw", (string)null);
                });

            modelBuilder.Entity("CommonLib.Objects.SecurityStatistics", b =>
                {
                    b.Property<int?>("SecurityId")
                        .HasColumnType("integer")
                        .HasColumnName("SecurityId");

                    b.Property<DateTime>("CreateDate")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("CreateDate");

                    b.Property<string>("Data")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("Data");

                    b.HasKey("SecurityId");

                    b.ToTable("SecurityKeyStatisticsSet", (string)null);
                });

            modelBuilder.Entity("CommonLib.Objects.SnapshootData", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid")
                        .HasColumnName("Id");

                    b.Property<DateTime>("ChangeDate")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("ChangeDate");

                    b.Property<string>("Data")
                        .HasColumnType("text")
                        .HasColumnName("Data");

                    b.HasKey("Id");

                    b.ToTable("SnapshootSet", (string)null);
                });

            modelBuilder.Entity("CommonLib.Objects.YahooFinanceRaw", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid")
                        .HasColumnName("Id");

                    b.Property<string>("Code")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("Code");

                    b.Property<string>("Data")
                        .HasColumnType("text")
                        .HasColumnName("Data");

                    b.Property<DateTime?>("LastFinance")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("LastFinance");

                    b.Property<DateTime?>("LoadDate")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("LoadDate");

                    b.Property<byte>("Status")
                        .HasColumnType("smallint")
                        .HasColumnName("Status");

                    b.HasKey("Id");

                    b.ToTable("YahooFinanceRawSet", (string)null);
                });

            modelBuilder.Entity("CommonLib.Objects.Bond", b =>
                {
                    b.HasBaseType("CommonLib.Objects.Security");

                    b.Property<string>("NKDCurrency")
                        .HasColumnType("text")
                        .HasColumnName("NKDCurrency");

                    b.Property<decimal>("NominalPrice")
                        .HasColumnType("numeric")
                        .HasColumnName("NominalPrice");

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
                        .HasColumnType("text")
                        .HasColumnName("Structure");

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

                    b.Navigation("Account");

                    b.Navigation("security");
                });

            modelBuilder.Entity("CommonLib.Objects.EmitentProfile", b =>
                {
                    b.HasOne("CommonLib.Objects.Emitent", "Emitent")
                        .WithOne("EmitentProfile")
                        .HasForeignKey("CommonLib.Objects.EmitentProfile", "EmitentId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Emitent");
                });

            modelBuilder.Entity("CommonLib.Objects.Financial", b =>
                {
                    b.HasOne("CommonLib.Objects.Emitent", "Emitent")
                        .WithMany("Financials")
                        .HasForeignKey("EmitentId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Emitent");
                });

            modelBuilder.Entity("CommonLib.Objects.FinancialData", b =>
                {
                    b.HasOne("CommonLib.Objects.Security", "Security")
                        .WithOne("FinancialData")
                        .HasForeignKey("CommonLib.Objects.FinancialData", "SecurityId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Security");
                });

            modelBuilder.Entity("CommonLib.Objects.MarketIndexChanges", b =>
                {
                    b.HasOne("CommonLib.Objects.MarketIndex", "MarketIndex")
                        .WithMany("Changes")
                        .HasForeignKey("MarketIndexId");

                    b.Navigation("MarketIndex");
                });

            modelBuilder.Entity("CommonLib.Objects.MarketIndexComponent", b =>
                {
                    b.HasOne("CommonLib.Objects.MarketIndex", "MarketIndex")
                        .WithMany("Constituents")
                        .HasForeignKey("MarketIndexId");

                    b.Navigation("MarketIndex");
                });

            modelBuilder.Entity("CommonLib.Objects.PortfolioAccounts", b =>
                {
                    b.HasOne("CommonLib.Objects.Account", "Account")
                        .WithMany("PortfolioAccounts")
                        .HasForeignKey("AccountId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("CommonLib.Objects.Portfolio", "Portfolio")
                        .WithMany("PortfolioAccounts")
                        .HasForeignKey("PortfolioId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Account");

                    b.Navigation("Portfolio");
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

                    b.Navigation("Account");

                    b.Navigation("Security");
                });

            modelBuilder.Entity("CommonLib.Objects.Security", b =>
                {
                    b.HasOne("CommonLib.Objects.Emitent", "Emitent")
                        .WithMany("Securities")
                        .HasForeignKey("EmitentId");

                    b.Navigation("Emitent");
                });

            modelBuilder.Entity("CommonLib.Objects.SecurityStatistics", b =>
                {
                    b.HasOne("CommonLib.Objects.Security", "Security")
                        .WithOne("SecurityStatistics")
                        .HasForeignKey("CommonLib.Objects.SecurityStatistics", "SecurityId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Security");
                });

            modelBuilder.Entity("CommonLib.Objects.Account", b =>
                {
                    b.Navigation("Deals");

                    b.Navigation("PortfolioAccounts");

                    b.Navigation("Positions");
                });

            modelBuilder.Entity("CommonLib.Objects.Emitent", b =>
                {
                    b.Navigation("EmitentProfile");

                    b.Navigation("Financials");

                    b.Navigation("Securities");
                });

            modelBuilder.Entity("CommonLib.Objects.MarketIndex", b =>
                {
                    b.Navigation("Changes");

                    b.Navigation("Constituents");
                });

            modelBuilder.Entity("CommonLib.Objects.Portfolio", b =>
                {
                    b.Navigation("PortfolioAccounts");
                });

            modelBuilder.Entity("CommonLib.Objects.Security", b =>
                {
                    b.Navigation("Deals");

                    b.Navigation("FinancialData");

                    b.Navigation("Positions");

                    b.Navigation("SecurityStatistics");
                });
#pragma warning restore 612, 618
        }
    }
}
