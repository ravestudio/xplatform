using Microsoft.EntityFrameworkCore.Migrations;

namespace xplatform.Migrations
{
    public partial class renameStatisctsTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SecurityProfileSet_SecuritySet_SecurityId",
                table: "SecurityProfileSet");

            migrationBuilder.DropPrimaryKey(
                name: "PK_SecurityProfileSet",
                table: "SecurityProfileSet");

            migrationBuilder.RenameTable(
                name: "SecurityProfileSet",
                newName: "SecurityKeyStatisticsSet");

            migrationBuilder.AddPrimaryKey(
                name: "PK_SecurityKeyStatisticsSet",
                table: "SecurityKeyStatisticsSet",
                column: "SecurityId");

            migrationBuilder.AddForeignKey(
                name: "FK_SecurityKeyStatisticsSet_SecuritySet_SecurityId",
                table: "SecurityKeyStatisticsSet",
                column: "SecurityId",
                principalTable: "SecuritySet",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SecurityKeyStatisticsSet_SecuritySet_SecurityId",
                table: "SecurityKeyStatisticsSet");

            migrationBuilder.DropPrimaryKey(
                name: "PK_SecurityKeyStatisticsSet",
                table: "SecurityKeyStatisticsSet");

            migrationBuilder.RenameTable(
                name: "SecurityKeyStatisticsSet",
                newName: "SecurityProfileSet");

            migrationBuilder.AddPrimaryKey(
                name: "PK_SecurityProfileSet",
                table: "SecurityProfileSet",
                column: "SecurityId");

            migrationBuilder.AddForeignKey(
                name: "FK_SecurityProfileSet_SecuritySet_SecurityId",
                table: "SecurityProfileSet",
                column: "SecurityId",
                principalTable: "SecuritySet",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
