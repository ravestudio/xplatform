using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace xplatform.Migrations
{
    public partial class AddMarketIndex : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "MarketIndexSet",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    Name = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MarketIndexSet", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "MarketIndexComponentSet",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    Code = table.Column<string>(nullable: false),
                    MarketIndexId = table.Column<Guid>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MarketIndexComponentSet", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MarketIndexComponentSet_MarketIndexSet_MarketIndexId",
                        column: x => x.MarketIndexId,
                        principalTable: "MarketIndexSet",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_MarketIndexComponentSet_MarketIndexId",
                table: "MarketIndexComponentSet",
                column: "MarketIndexId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MarketIndexComponentSet");

            migrationBuilder.DropTable(
                name: "MarketIndexSet");
        }
    }
}
