using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace xplatform.Migrations
{
    /// <inheritdoc />
    public partial class addIncome : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "income_set",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    incomeType = table.Column<string>(type: "text", nullable: true),
                    sourse = table.Column<string>(type: "text", nullable: true),
                    paymentDate = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    volume = table.Column<decimal>(type: "numeric", nullable: false),
                    taxes = table.Column<decimal>(type: "numeric", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_income_set", x => x.id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "income_set");
        }
    }
}
