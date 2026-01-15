using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class updateclasstable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Classes_AcademicYears_AcademicYearId",
                table: "Classes");

            migrationBuilder.DropIndex(
                name: "IX_Classes_AcademicYearId",
                table: "Classes");

            migrationBuilder.DropColumn(
                name: "AcademicYearId",
                table: "Classes");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AcademicYearId",
                table: "Classes",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Classes_AcademicYearId",
                table: "Classes",
                column: "AcademicYearId");

            migrationBuilder.AddForeignKey(
                name: "FK_Classes_AcademicYears_AcademicYearId",
                table: "Classes",
                column: "AcademicYearId",
                principalTable: "AcademicYears",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
