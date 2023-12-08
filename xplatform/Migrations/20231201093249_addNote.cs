using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace xplatform.Migrations
{
    /// <inheritdoc />
    public partial class addNote : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "NoteSet",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    EmitentId = table.Column<int>(type: "integer", nullable: true),
                    ChangeDate = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    Data = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NoteSet", x => x.Id);
                    table.ForeignKey(
                        name: "FK_NoteSet_EmitentSet_EmitentId",
                        column: x => x.EmitentId,
                        principalTable: "EmitentSet",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_NoteSet_EmitentId",
                table: "NoteSet",
                column: "EmitentId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "NoteSet");
        }
    }
}
