using Microsoft.EntityFrameworkCore.Migrations;

namespace xplatform.Migrations
{
    public partial class quoteKey : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_QuoteSet",
                table: "QuoteSet");

            migrationBuilder.AlterColumn<string>(
                name: "Symbol",
                table: "QuoteSet",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddPrimaryKey(
                name: "PK_QuoteSet",
                table: "QuoteSet",
                column: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_QuoteSet",
                table: "QuoteSet");

            migrationBuilder.AlterColumn<string>(
                name: "Symbol",
                table: "QuoteSet",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_QuoteSet",
                table: "QuoteSet",
                column: "Symbol");
        }
    }
}
