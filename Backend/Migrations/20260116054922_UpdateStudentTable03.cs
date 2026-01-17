using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class UpdateStudentTable03 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Students_CurrentClassID",
                table: "Students",
                column: "CurrentClassID");

            migrationBuilder.CreateIndex(
                name: "IX_Students_CurrentGradeID",
                table: "Students",
                column: "CurrentGradeID");

            migrationBuilder.CreateIndex(
                name: "IX_Students_CurrentYearID",
                table: "Students",
                column: "CurrentYearID");

            migrationBuilder.AddForeignKey(
                name: "FK_Students_AcademicYears_CurrentYearID",
                table: "Students",
                column: "CurrentYearID",
                principalTable: "AcademicYears",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Students_Classes_CurrentClassID",
                table: "Students",
                column: "CurrentClassID",
                principalTable: "Classes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Students_Grades_CurrentGradeID",
                table: "Students",
                column: "CurrentGradeID",
                principalTable: "Grades",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Students_AcademicYears_CurrentYearID",
                table: "Students");

            migrationBuilder.DropForeignKey(
                name: "FK_Students_Classes_CurrentClassID",
                table: "Students");

            migrationBuilder.DropForeignKey(
                name: "FK_Students_Grades_CurrentGradeID",
                table: "Students");

            migrationBuilder.DropIndex(
                name: "IX_Students_CurrentClassID",
                table: "Students");

            migrationBuilder.DropIndex(
                name: "IX_Students_CurrentGradeID",
                table: "Students");

            migrationBuilder.DropIndex(
                name: "IX_Students_CurrentYearID",
                table: "Students");
        }
    }
}
