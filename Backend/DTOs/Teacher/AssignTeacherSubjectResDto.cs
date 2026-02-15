using Backend.Models;
using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs.Teacher
{
    public class AssignTeacherSubjectResDto
    {
        public int Id { get; set; }

        public string? TeacherName { get; set; }

        public string? SubjectName { get; set; }

        public int subjectId {  get; set; }

        public string? ClassName { get; set; }

        public int ClassId {  get; set; }

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public bool IsActive { get; set; }

        public string? Description { get; set; }

    }
}
