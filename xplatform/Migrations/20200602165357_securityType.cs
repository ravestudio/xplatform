using Microsoft.EntityFrameworkCore.Migrations;

namespace xplatform.Migrations
{
    public partial class securityType : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Structure",
                table: "SecuritySet",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Type",
                table: "SecuritySet",
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Structure",
                table: "SecuritySet");

            migrationBuilder.DropColumn(
                name: "Type",
                table: "SecuritySet");
        }
    }
}
