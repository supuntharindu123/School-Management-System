using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddandUpdateExamTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ExamGrade_Exams_ExamId",
                table: "ExamGrade");

            migrationBuilder.DropForeignKey(
                name: "FK_ExamGrade_Grades_GradeId",
                table: "ExamGrade");

            migrationBuilder.DropForeignKey(
                name: "FK_ExamGradeSubject_Exams_ExamId",
                table: "ExamGradeSubject");

            migrationBuilder.DropForeignKey(
                name: "FK_ExamGradeSubject_Grades_GradeId",
                table: "ExamGradeSubject");

            migrationBuilder.DropForeignKey(
                name: "FK_ExamGradeSubject_Subjects_SubjectId",
                table: "ExamGradeSubject");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ExamGradeSubject",
                table: "ExamGradeSubject");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ExamGrade",
                table: "ExamGrade");

            migrationBuilder.RenameTable(
                name: "ExamGradeSubject",
                newName: "ExamGradeSubjects");

            migrationBuilder.RenameTable(
                name: "ExamGrade",
                newName: "ExamGrades");

            migrationBuilder.RenameIndex(
                name: "IX_ExamGradeSubject_SubjectId",
                table: "ExamGradeSubjects",
                newName: "IX_ExamGradeSubjects_SubjectId");

            migrationBuilder.RenameIndex(
                name: "IX_ExamGradeSubject_GradeId",
                table: "ExamGradeSubjects",
                newName: "IX_ExamGradeSubjects_GradeId");

            migrationBuilder.RenameIndex(
                name: "IX_ExamGradeSubject_ExamId",
                table: "ExamGradeSubjects",
                newName: "IX_ExamGradeSubjects_ExamId");

            migrationBuilder.RenameIndex(
                name: "IX_ExamGrade_GradeId",
                table: "ExamGrades",
                newName: "IX_ExamGrades_GradeId");

            migrationBuilder.RenameIndex(
                name: "IX_ExamGrade_ExamId",
                table: "ExamGrades",
                newName: "IX_ExamGrades_ExamId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ExamGradeSubjects",
                table: "ExamGradeSubjects",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ExamGrades",
                table: "ExamGrades",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ExamGrades_Exams_ExamId",
                table: "ExamGrades",
                column: "ExamId",
                principalTable: "Exams",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ExamGrades_Grades_GradeId",
                table: "ExamGrades",
                column: "GradeId",
                principalTable: "Grades",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ExamGradeSubjects_Exams_ExamId",
                table: "ExamGradeSubjects",
                column: "ExamId",
                principalTable: "Exams",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ExamGradeSubjects_Grades_GradeId",
                table: "ExamGradeSubjects",
                column: "GradeId",
                principalTable: "Grades",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ExamGradeSubjects_Subjects_SubjectId",
                table: "ExamGradeSubjects",
                column: "SubjectId",
                principalTable: "Subjects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ExamGrades_Exams_ExamId",
                table: "ExamGrades");

            migrationBuilder.DropForeignKey(
                name: "FK_ExamGrades_Grades_GradeId",
                table: "ExamGrades");

            migrationBuilder.DropForeignKey(
                name: "FK_ExamGradeSubjects_Exams_ExamId",
                table: "ExamGradeSubjects");

            migrationBuilder.DropForeignKey(
                name: "FK_ExamGradeSubjects_Grades_GradeId",
                table: "ExamGradeSubjects");

            migrationBuilder.DropForeignKey(
                name: "FK_ExamGradeSubjects_Subjects_SubjectId",
                table: "ExamGradeSubjects");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ExamGradeSubjects",
                table: "ExamGradeSubjects");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ExamGrades",
                table: "ExamGrades");

            migrationBuilder.RenameTable(
                name: "ExamGradeSubjects",
                newName: "ExamGradeSubject");

            migrationBuilder.RenameTable(
                name: "ExamGrades",
                newName: "ExamGrade");

            migrationBuilder.RenameIndex(
                name: "IX_ExamGradeSubjects_SubjectId",
                table: "ExamGradeSubject",
                newName: "IX_ExamGradeSubject_SubjectId");

            migrationBuilder.RenameIndex(
                name: "IX_ExamGradeSubjects_GradeId",
                table: "ExamGradeSubject",
                newName: "IX_ExamGradeSubject_GradeId");

            migrationBuilder.RenameIndex(
                name: "IX_ExamGradeSubjects_ExamId",
                table: "ExamGradeSubject",
                newName: "IX_ExamGradeSubject_ExamId");

            migrationBuilder.RenameIndex(
                name: "IX_ExamGrades_GradeId",
                table: "ExamGrade",
                newName: "IX_ExamGrade_GradeId");

            migrationBuilder.RenameIndex(
                name: "IX_ExamGrades_ExamId",
                table: "ExamGrade",
                newName: "IX_ExamGrade_ExamId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ExamGradeSubject",
                table: "ExamGradeSubject",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ExamGrade",
                table: "ExamGrade",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ExamGrade_Exams_ExamId",
                table: "ExamGrade",
                column: "ExamId",
                principalTable: "Exams",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ExamGrade_Grades_GradeId",
                table: "ExamGrade",
                column: "GradeId",
                principalTable: "Grades",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ExamGradeSubject_Exams_ExamId",
                table: "ExamGradeSubject",
                column: "ExamId",
                principalTable: "Exams",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ExamGradeSubject_Grades_GradeId",
                table: "ExamGradeSubject",
                column: "GradeId",
                principalTable: "Grades",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ExamGradeSubject_Subjects_SubjectId",
                table: "ExamGradeSubject",
                column: "SubjectId",
                principalTable: "Subjects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
