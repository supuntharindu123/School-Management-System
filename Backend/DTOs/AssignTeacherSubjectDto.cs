using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs
{
    public class AssignTeacherSubjectDto
    {
        public int Id { get; set; }

        public int TeacherId { get; set; }

        public int SubjectId { get; set; }

        public int ClassId { get; set; }

        public bool IsActive { get; set; }

        public string? Description { get; set; }
    }
}
