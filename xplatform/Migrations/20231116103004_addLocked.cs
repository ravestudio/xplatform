using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace xplatform.Migrations
{
    /// <inheritdoc />
    public partial class addLocked : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Locked",
                table: "DealSet",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Locked",
                table: "DealSet");
        }
    }
}
