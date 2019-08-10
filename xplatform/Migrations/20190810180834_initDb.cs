using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace xplatform.Migrations
{
    public partial class initDb : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AccountSet",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    Name = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AccountSet", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "EmitentSet",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    Name = table.Column<string>(nullable: true),
                    Description = table.Column<string>(nullable: true),
                    WebSite = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EmitentSet", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "FinancialSet",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    Year = table.Column<int>(nullable: false),
                    Period = table.Column<int>(nullable: false),
                    Revenue = table.Column<decimal>(type: "decimal(18, 2)", nullable: false),
                    OperatingIncome = table.Column<decimal>(type: "decimal(18, 2)", nullable: false),
                    NetIncome = table.Column<decimal>(type: "decimal(18, 2)", nullable: false),
                    CurrentAssets = table.Column<decimal>(type: "decimal(18, 2)", nullable: false),
                    FixedAssets = table.Column<decimal>(type: "decimal(18, 2)", nullable: false),
                    CurrentLiabilities = table.Column<decimal>(type: "decimal(18, 2)", nullable: false),
                    LongTermLiabilities = table.Column<decimal>(type: "decimal(18, 2)", nullable: false),
                    FlowOperatingActivities = table.Column<decimal>(type: "decimal(18, 2)", nullable: false),
                    Amortization = table.Column<decimal>(type: "decimal(18, 2)", nullable: false),
                    NWC = table.Column<decimal>(type: "decimal(18, 2)", nullable: false),
                    Capex = table.Column<decimal>(type: "decimal(18, 2)", nullable: false),
                    IncomeTaxPaid = table.Column<decimal>(type: "decimal(18, 2)", nullable: false),
                    FlowInvestingActivities = table.Column<decimal>(type: "decimal(18, 2)", nullable: false),
                    FlowFinancingActivities = table.Column<decimal>(type: "decimal(18, 2)", nullable: false),
                    StockIssuance = table.Column<decimal>(type: "decimal(18, 2)", nullable: false),
                    DividendsPaid = table.Column<decimal>(type: "decimal(18, 2)", nullable: false),
                    EarningsPerShare = table.Column<decimal>(type: "decimal(18, 2)", nullable: false),
                    Price = table.Column<decimal>(type: "decimal(18, 2)", nullable: false),
                    EmitentId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FinancialSet", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FinancialSet_EmitentSet_EmitentId",
                        column: x => x.EmitentId,
                        principalTable: "EmitentSet",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SecuritySet",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    Name = table.Column<string>(nullable: true),
                    Code = table.Column<string>(nullable: true),
                    EmitentId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SecuritySet", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SecuritySet_EmitentSet_EmitentId",
                        column: x => x.EmitentId,
                        principalTable: "EmitentSet",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DealSet",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    accountId = table.Column<int>(nullable: false),
                    Number = table.Column<decimal>(nullable: false),
                    Operation = table.Column<byte>(nullable: false),
                    Date = table.Column<DateTime>(nullable: false),
                    DeliveryDate = table.Column<DateTime>(nullable: false),
                    Price = table.Column<decimal>(nullable: false),
                    Count = table.Column<int>(nullable: false),
                    Volume = table.Column<decimal>(nullable: false),
                    securityId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DealSet", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DealSet_AccountSet_accountId",
                        column: x => x.accountId,
                        principalTable: "AccountSet",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DealSet_SecuritySet_securityId",
                        column: x => x.securityId,
                        principalTable: "SecuritySet",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PositionSet",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    OpenDate = table.Column<DateTime>(nullable: false),
                    securityId = table.Column<int>(nullable: false),
                    accountId = table.Column<int>(nullable: false),
                    Limit = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PositionSet", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PositionSet_AccountSet_accountId",
                        column: x => x.accountId,
                        principalTable: "AccountSet",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PositionSet_SecuritySet_securityId",
                        column: x => x.securityId,
                        principalTable: "SecuritySet",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DealSet_accountId",
                table: "DealSet",
                column: "accountId");

            migrationBuilder.CreateIndex(
                name: "IX_DealSet_securityId",
                table: "DealSet",
                column: "securityId");

            migrationBuilder.CreateIndex(
                name: "IX_FinancialSet_EmitentId",
                table: "FinancialSet",
                column: "EmitentId");

            migrationBuilder.CreateIndex(
                name: "IX_PositionSet_accountId",
                table: "PositionSet",
                column: "accountId");

            migrationBuilder.CreateIndex(
                name: "IX_PositionSet_securityId",
                table: "PositionSet",
                column: "securityId");

            migrationBuilder.CreateIndex(
                name: "IX_SecuritySet_EmitentId",
                table: "SecuritySet",
                column: "EmitentId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DealSet");

            migrationBuilder.DropTable(
                name: "FinancialSet");

            migrationBuilder.DropTable(
                name: "PositionSet");

            migrationBuilder.DropTable(
                name: "AccountSet");

            migrationBuilder.DropTable(
                name: "SecuritySet");

            migrationBuilder.DropTable(
                name: "EmitentSet");
        }
    }
}
