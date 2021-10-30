using Microsoft.EntityFrameworkCore.Migrations;

namespace xplatform.Migrations
{
    public partial class addMarketRaw : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "market_raw",
                columns: table => new
                {
                    symbol = table.Column<string>(nullable: false),
                    board = table.Column<string>(nullable: false),
                    lotSize = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_market_raw", x => new { x.symbol, x.board });
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "market_raw");
        }
    }
}
