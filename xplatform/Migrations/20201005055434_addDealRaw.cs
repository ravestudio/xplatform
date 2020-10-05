using Microsoft.EntityFrameworkCore.Migrations;

namespace xplatform.Migrations
{
    public partial class addDealRaw : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "deal_raw",
                columns: table => new
                {
                    number = table.Column<decimal>(nullable: false),
                    board = table.Column<string>(nullable: false),
                    symbol = table.Column<string>(nullable: true),
                    operation = table.Column<string>(nullable: true),
                    date = table.Column<string>(nullable: true),
                    time = table.Column<string>(nullable: true),
                    delivery_date = table.Column<string>(nullable: true),
                    price = table.Column<decimal>(nullable: false),
                    count = table.Column<int>(nullable: false),
                    volume = table.Column<decimal>(nullable: false),
                    nkd = table.Column<decimal>(nullable: true),
                    client = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_deal_raw", x => new { x.number, x.board });
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "deal_raw");
        }
    }
}
