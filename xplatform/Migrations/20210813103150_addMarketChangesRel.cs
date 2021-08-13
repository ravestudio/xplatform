using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace xplatform.Migrations
{
    public partial class addMarketChangesRel : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "MarketIndexId",
                table: "MarketIndexChangesSet",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_MarketIndexChangesSet_MarketIndexId",
                table: "MarketIndexChangesSet",
                column: "MarketIndexId");

            migrationBuilder.AddForeignKey(
                name: "FK_MarketIndexChangesSet_MarketIndexSet_MarketIndexId",
                table: "MarketIndexChangesSet",
                column: "MarketIndexId",
                principalTable: "MarketIndexSet",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MarketIndexChangesSet_MarketIndexSet_MarketIndexId",
                table: "MarketIndexChangesSet");

            migrationBuilder.DropIndex(
                name: "IX_MarketIndexChangesSet_MarketIndexId",
                table: "MarketIndexChangesSet");

            migrationBuilder.DropColumn(
                name: "MarketIndexId",
                table: "MarketIndexChangesSet");
        }
    }
}
