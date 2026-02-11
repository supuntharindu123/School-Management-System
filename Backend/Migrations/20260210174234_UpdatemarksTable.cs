using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class UpdatemarksTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Marks_TeacherSubjectClasses_TeacherSubjectClassId",
                table: "Marks");

            migrationBuilder.RenameColumn(
                name: "TeacherSubjectClassId",
                table: "Marks",
                newName: "TeacherId");

            migrationBuilder.RenameIndex(
                name: "IX_Marks_TeacherSubjectClassId",
                table: "Marks",
                newName: "IX_Marks_TeacherId");

            migrationBuilder.AddColumn<int>(
                name: "ClassId",
                table: "Marks",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "GradeId",
                table: "Marks",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "IsPresent",
                table: "Marks",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "Reason",
                table: "Marks",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Marks_ClassId",
                table: "Marks",
                column: "ClassId");

            migrationBuilder.CreateIndex(
                name: "IX_Marks_GradeId",
                table: "Marks",
                column: "GradeId");

            migrationBuilder.AddForeignKey(
                name: "FK_Marks_Classes_ClassId",
                table: "Marks",
                column: "ClassId",
                principalTable: "Classes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Marks_Grades_GradeId",
                table: "Marks",
                column: "GradeId",
                principalTable: "Grades",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Marks_Teachers_TeacherId",
                table: "Marks",
                column: "TeacherId",
                principalTable: "Teachers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Marks_Classes_ClassId",
                table: "Marks");

            migrationBuilder.DropForeignKey(
                name: "FK_Marks_Grades_GradeId",
                table: "Marks");

            migrationBuilder.DropForeignKey(
                name: "FK_Marks_Teachers_TeacherId",
                table: "Marks");

            migrationBuilder.DropIndex(
                name: "IX_Marks_ClassId",
                table: "Marks");

            migrationBuilder.DropIndex(
                name: "IX_Marks_GradeId",
                table: "Marks");

            migrationBuilder.DropColumn(
                name: "ClassId",
                table: "Marks");

            migrationBuilder.DropColumn(
                name: "GradeId",
                table: "Marks");

            migrationBuilder.DropColumn(
                name: "IsPresent",
                table: "Marks");

            migrationBuilder.DropColumn(
                name: "Reason",
                table: "Marks");

            migrationBuilder.RenameColumn(
                name: "TeacherId",
                table: "Marks",
                newName: "TeacherSubjectClassId");

            migrationBuilder.RenameIndex(
                name: "IX_Marks_TeacherId",
                table: "Marks",
                newName: "IX_Marks_TeacherSubjectClassId");

            migrationBuilder.AddForeignKey(
                name: "FK_Marks_TeacherSubjectClasses_TeacherSubjectClassId",
                table: "Marks",
                column: "TeacherSubjectClassId",
                principalTable: "TeacherSubjectClasses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
