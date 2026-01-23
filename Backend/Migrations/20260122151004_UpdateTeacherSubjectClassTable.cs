using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class UpdateTeacherSubjectClassTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TeacherSubjectTasks");

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "TeacherSubjectClasses",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "EndDate",
                table: "TeacherSubjectClasses",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "TeacherSubjectClasses",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "StartDate",
                table: "TeacherSubjectClasses",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Description",
                table: "TeacherSubjectClasses");

            migrationBuilder.DropColumn(
                name: "EndDate",
                table: "TeacherSubjectClasses");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "TeacherSubjectClasses");

            migrationBuilder.DropColumn(
                name: "StartDate",
                table: "TeacherSubjectClasses");

            migrationBuilder.CreateTable(
                name: "TeacherSubjectTasks",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TeacherSubjectClassId = table.Column<int>(type: "int", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TeacherSubjectTasks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TeacherSubjectTasks_TeacherSubjectClasses_TeacherSubjectClassId",
                        column: x => x.TeacherSubjectClassId,
                        principalTable: "TeacherSubjectClasses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TeacherSubjectTasks_TeacherSubjectClassId",
                table: "TeacherSubjectTasks",
                column: "TeacherSubjectClassId");
        }
    }
}
