using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace xplatform.Migrations
{
    public partial class addFinData : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "FinancialDataSet",
                columns: table => new
                {
                    EmitentId = table.Column<int>(nullable: false),
                    Data = table.Column<string>(nullable: false),
                    CreateDate = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FinancialDataSet", x => x.EmitentId);
                    table.ForeignKey(
                        name: "FK_FinancialDataSet_EmitentSet_EmitentId",
                        column: x => x.EmitentId,
                        principalTable: "EmitentSet",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FinancialDataSet");
        }
    }
}
