using Microsoft.EntityFrameworkCore.Migrations;

namespace xplatform.Migrations
{
    public partial class moveFinData : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FinancialDataSet_EmitentSet_EmitentId",
                table: "FinancialDataSet");

            migrationBuilder.DropPrimaryKey(
                name: "PK_FinancialDataSet",
                table: "FinancialDataSet");

            migrationBuilder.DropColumn(
                name: "EmitentId",
                table: "FinancialDataSet");

            migrationBuilder.AddColumn<int>(
                name: "SecurityId",
                table: "FinancialDataSet",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_FinancialDataSet",
                table: "FinancialDataSet",
                column: "SecurityId");

            migrationBuilder.AddForeignKey(
                name: "FK_FinancialDataSet_SecuritySet_SecurityId",
                table: "FinancialDataSet",
                column: "SecurityId",
                principalTable: "SecuritySet",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FinancialDataSet_SecuritySet_SecurityId",
                table: "FinancialDataSet");

            migrationBuilder.DropPrimaryKey(
                name: "PK_FinancialDataSet",
                table: "FinancialDataSet");

            migrationBuilder.DropColumn(
                name: "SecurityId",
                table: "FinancialDataSet");

            migrationBuilder.AddColumn<int>(
                name: "EmitentId",
                table: "FinancialDataSet",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_FinancialDataSet",
                table: "FinancialDataSet",
                column: "EmitentId");

            migrationBuilder.AddForeignKey(
                name: "FK_FinancialDataSet_EmitentSet_EmitentId",
                table: "FinancialDataSet",
                column: "EmitentId",
                principalTable: "EmitentSet",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
