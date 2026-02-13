namespace Backend.DTOs.Teacher
{
    public class ClassTeacherDto
    {
        public int TeacherId { get; set; }
        public string? TeacherName { get; set; }
        public string? Role { get; set; }
        public bool IsActive { get; set; }
        public string? CreatedDate {  get; set; }
        public string? UpdatedDate {  get; set; }
    }
}
