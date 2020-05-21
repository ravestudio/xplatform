using Microsoft.EntityFrameworkCore.Migrations;

namespace xplatform.Migrations
{
    public partial class addRegion : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Currency",
                table: "SecuritySet",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Region",
                table: "SecuritySet",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Currency",
                table: "SecuritySet");

            migrationBuilder.DropColumn(
                name: "Region",
                table: "SecuritySet");
        }
    }
}
