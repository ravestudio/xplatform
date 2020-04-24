using Microsoft.EntityFrameworkCore.Migrations;

namespace xplatform.Migrations
{
    public partial class addMarketBoard : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Board",
                table: "SecuritySet",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Market",
                table: "SecuritySet",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Board",
                table: "SecuritySet");

            migrationBuilder.DropColumn(
                name: "Market",
                table: "SecuritySet");
        }
    }
}
