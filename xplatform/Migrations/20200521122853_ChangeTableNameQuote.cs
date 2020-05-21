using Microsoft.EntityFrameworkCore.Migrations;

namespace xplatform.Migrations
{
    public partial class ChangeTableNameQuote : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Quote",
                table: "Quote");

            migrationBuilder.RenameTable(
                name: "Quote",
                newName: "QuoteSet");

            migrationBuilder.AddPrimaryKey(
                name: "PK_QuoteSet",
                table: "QuoteSet",
                column: "Symbol");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_QuoteSet",
                table: "QuoteSet");

            migrationBuilder.RenameTable(
                name: "QuoteSet",
                newName: "Quote");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Quote",
                table: "Quote",
                column: "Symbol");
        }
    }
}
