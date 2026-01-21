using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class UpdateTeacherClassAssignTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_History0fStudents_Students_StudentId",
                table: "History0fStudents");

            migrationBuilder.AddColumn<string>(
                name: "Role",
                table: "TeacherClassAssign",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_History0fStudents_Students_StudentId",
                table: "History0fStudents",
                column: "StudentId",
                principalTable: "Students",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_History0fStudents_Students_StudentId",
                table: "History0fStudents");

            migrationBuilder.DropColumn(
                name: "Role",
                table: "TeacherClassAssign");

            migrationBuilder.AddForeignKey(
                name: "FK_History0fStudents_Students_StudentId",
                table: "History0fStudents",
                column: "StudentId",
                principalTable: "Students",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
