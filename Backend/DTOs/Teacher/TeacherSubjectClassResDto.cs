namespace Backend.DTOs.Teacher
{
    public class TeacherSubjectClassResDto
    {
        public int Id { get; set; }
        public int SubjectId { get; set; }
        public string? SubjectName { get; set; }
        public int ClassId { get; set; }
        public string? ClassName { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public bool IsActive { get; set; }
        public string? Description { get; set; }
    }
}
