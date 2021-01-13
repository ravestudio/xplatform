using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace xplatform.Migrations
{
    public partial class yahooStatus : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Processed",
                table: "YahooFinanceRawSet");

            migrationBuilder.AlterColumn<DateTime>(
                name: "LoadDate",
                table: "YahooFinanceRawSet",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "timestamp without time zone");

            migrationBuilder.AlterColumn<DateTime>(
                name: "LastFinance",
                table: "YahooFinanceRawSet",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "timestamp without time zone");

            migrationBuilder.AlterColumn<string>(
                name: "Data",
                table: "YahooFinanceRawSet",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddColumn<byte>(
                name: "Status",
                table: "YahooFinanceRawSet",
                nullable: false,
                defaultValue: (byte)0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Status",
                table: "YahooFinanceRawSet");

            migrationBuilder.AlterColumn<DateTime>(
                name: "LoadDate",
                table: "YahooFinanceRawSet",
                type: "timestamp without time zone",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "LastFinance",
                table: "YahooFinanceRawSet",
                type: "timestamp without time zone",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Data",
                table: "YahooFinanceRawSet",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "Processed",
                table: "YahooFinanceRawSet",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }
    }
}
