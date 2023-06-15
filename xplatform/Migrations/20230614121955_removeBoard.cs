using Microsoft.EntityFrameworkCore.Migrations;

namespace xplatform.Migrations
{
    public partial class removeBoard : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Board",
                table: "SecuritySet");

            migrationBuilder.DropColumn(
                name: "Market",
                table: "SecuritySet");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Board",
                table: "SecuritySet",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Market",
                table: "SecuritySet",
                type: "text",
                nullable: true);
        }
    }
}
