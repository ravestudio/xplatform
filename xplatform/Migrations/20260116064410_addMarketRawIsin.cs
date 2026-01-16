using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace xplatform.Migrations
{
    /// <inheritdoc />
    public partial class addMarketRawIsin : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "isin",
                table: "market_raw",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "isin",
                table: "market_raw");
        }
    }
}
