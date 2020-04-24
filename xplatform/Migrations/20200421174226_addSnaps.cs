using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace xplatform.Migrations
{
    public partial class addSnaps : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "SnapshootSet",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    ChangeDate = table.Column<DateTime>(nullable: false),
                    Data = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SnapshootSet", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SnapshootSet");
        }
    }
}
