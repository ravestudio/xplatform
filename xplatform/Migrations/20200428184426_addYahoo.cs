using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace xplatform.Migrations
{
    public partial class addYahoo : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "YahooFinanceRawSet",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    Code = table.Column<string>(nullable: false),
                    Data = table.Column<string>(nullable: false),
                    LoadDate = table.Column<DateTime>(nullable: false),
                    LastFinance = table.Column<DateTime>(nullable: false),
                    Processed = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_YahooFinanceRawSet", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "YahooFinanceRawSet");
        }
    }
}
