using Microsoft.EntityFrameworkCore.Migrations;

namespace xplatform.Migrations
{
    public partial class addName : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "lotSize",
                table: "market_raw",
                newName: "lotsize");

            migrationBuilder.AddColumn<string>(
                name: "name",
                table: "market_raw",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "name",
                table: "market_raw");

            migrationBuilder.RenameColumn(
                name: "lotsize",
                table: "market_raw",
                newName: "lotSize");
        }
    }
}
