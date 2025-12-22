using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace xplatform.Migrations
{
    /// <inheritdoc />
    public partial class addDividend : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "dividend_set",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    dividendNet = table.Column<decimal>(type: "numeric", nullable: false),
                    paymentDate = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    declaredDate = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    lastBuyDate = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    securityId = table.Column<int>(type: "integer", nullable: false),
                    processed = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_dividend_set", x => x.id);
                    table.ForeignKey(
                        name: "FK_dividend_set_SecuritySet_securityId",
                        column: x => x.securityId,
                        principalTable: "SecuritySet",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_dividend_set_securityId",
                table: "dividend_set",
                column: "securityId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "dividend_set");
        }
    }
}
