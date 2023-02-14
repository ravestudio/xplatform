using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace xplatform.Migrations
{
    public partial class addPortfolio : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PortfolioSet",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PortfolioSet", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PortfolioAccounts",
                columns: table => new
                {
                    AccountId = table.Column<int>(nullable: false),
                    PortfolioId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PortfolioAccounts", x => new { x.AccountId, x.PortfolioId });
                    table.ForeignKey(
                        name: "FK_PortfolioAccounts_AccountSet_AccountId",
                        column: x => x.AccountId,
                        principalTable: "AccountSet",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PortfolioAccounts_PortfolioSet_PortfolioId",
                        column: x => x.PortfolioId,
                        principalTable: "PortfolioSet",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PortfolioAccounts_PortfolioId",
                table: "PortfolioAccounts",
                column: "PortfolioId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PortfolioAccounts");

            migrationBuilder.DropTable(
                name: "PortfolioSet");
        }
    }
}
