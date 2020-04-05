using Microsoft.EntityFrameworkCore.Migrations;

namespace xplatform.Migrations
{
    public partial class nominalPrice : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "NominalPrice",
                table: "SecuritySet",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NominalPrice",
                table: "SecuritySet");
        }
    }
}
