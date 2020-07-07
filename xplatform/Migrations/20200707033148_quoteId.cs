using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace xplatform.Migrations
{
    public partial class quoteId : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SecuritySet_EmitentSet_EmitentId",
                table: "SecuritySet");

            migrationBuilder.AlterColumn<int>(
                name: "EmitentId",
                table: "SecuritySet",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddColumn<Guid>(
                name: "Id",
                table: "QuoteSet",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddForeignKey(
                name: "FK_SecuritySet_EmitentSet_EmitentId",
                table: "SecuritySet",
                column: "EmitentId",
                principalTable: "EmitentSet",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SecuritySet_EmitentSet_EmitentId",
                table: "SecuritySet");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "QuoteSet");

            migrationBuilder.AlterColumn<int>(
                name: "EmitentId",
                table: "SecuritySet",
                type: "integer",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_SecuritySet_EmitentSet_EmitentId",
                table: "SecuritySet",
                column: "EmitentId",
                principalTable: "EmitentSet",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
