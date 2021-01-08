using Microsoft.EntityFrameworkCore.Migrations;

namespace xplatform.Migrations
{
    public partial class addSecurityRaw : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ISIN",
                table: "SecuritySet",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "security_raw",
                columns: table => new
                {
                    isin = table.Column<string>(nullable: false),
                    figi = table.Column<string>(nullable: true),
                    ticker = table.Column<string>(nullable: true),
                    minPriceIncrement = table.Column<decimal>(nullable: false),
                    lot = table.Column<int>(nullable: false),
                    currency = table.Column<string>(nullable: true),
                    name = table.Column<string>(nullable: true),
                    type = table.Column<string>(nullable: true),
                    Processed = table.Column<bool>(nullable: false),
                    Board = table.Column<string>(nullable: true),
                    Emitent = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_security_raw", x => x.isin);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "security_raw");

            migrationBuilder.DropColumn(
                name: "ISIN",
                table: "SecuritySet");
        }
    }
}
