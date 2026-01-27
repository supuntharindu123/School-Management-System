namespace Backend.DTOs
{
    public class ClassTeacherDto
    {
        public int TeacherId { get; set; }
        public string? TeacherName { get; set; }
        public string? Role { get; set; }
        public bool IsActive { get; set; }
    }
}
