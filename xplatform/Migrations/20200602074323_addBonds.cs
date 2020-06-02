using Microsoft.EntityFrameworkCore.Migrations;

namespace xplatform.Migrations
{
    public partial class addBonds : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Market",
                table: "SecuritySet",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Market",
                table: "SecuritySet",
                type: "text",
                nullable: true,
                oldClrType: typeof(string));
        }
    }
}
