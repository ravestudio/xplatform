using Microsoft.EntityFrameworkCore.Migrations;

namespace xplatform.Migrations
{
    public partial class addInitdb : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "EmitentSet",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
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
                        .Annotation("Sqlite:Autoincrement", true),
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

            migrationBuilder.CreateIndex(
                name: "IX_FinancialSet_EmitentId",
                table: "FinancialSet",
                column: "EmitentId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FinancialSet");

            migrationBuilder.DropTable(
                name: "EmitentSet");
        }
    }
}
