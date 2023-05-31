using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace xplatform.Migrations
{
    public partial class addSecurityProfile : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "FinancialPage",
                table: "SecuritySet",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "SecurityProfileSet",
                columns: table => new
                {
                    SecurityId = table.Column<int>(nullable: false),
                    Data = table.Column<string>(nullable: false),
                    CreateDate = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SecurityProfileSet", x => x.SecurityId);
                    table.ForeignKey(
                        name: "FK_SecurityProfileSet_SecuritySet_SecurityId",
                        column: x => x.SecurityId,
                        principalTable: "SecuritySet",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SecurityProfileSet");

            migrationBuilder.DropColumn(
                name: "FinancialPage",
                table: "SecuritySet");
        }
    }
}
