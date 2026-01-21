using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class UpdateStudentAcademicHistoryTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_History0fStudents_AcademicYears_YearId",
                table: "History0fStudents");

            migrationBuilder.DropIndex(
                name: "IX_History0fStudents_YearId",
                table: "History0fStudents");

            migrationBuilder.DropColumn(
                name: "YearId",
                table: "History0fStudents");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "YearId",
                table: "History0fStudents",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_History0fStudents_YearId",
                table: "History0fStudents",
                column: "YearId");

            migrationBuilder.AddForeignKey(
                name: "FK_History0fStudents_AcademicYears_YearId",
                table: "History0fStudents",
                column: "YearId",
                principalTable: "AcademicYears",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
