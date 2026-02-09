namespace Backend.DTOs.Teacher
{
    public class ClassSubjectTeacherDto
    {
        public int SubjectId { get; set; }
        public string? SubjectName { get; set; }
        public int TeacherId { get; set; }
        public string? TeacherName { get; set; }
        public bool IsActive { get; set; }
    }
}
