namespace Backend.DTOs
{
    public class ClassDetailsResDto
    {
        public int Id { get; set; }
        public int ClassId { get; set; }
        public int GradeId { get; set; }
        public string? ClassName { get; set; }

        public List<StudentBasicDto> Students { get; set; } = new();
        public List<ClassTeacherDto> ClassTeachers { get; set; } = new();
        public List<ClassSubjectTeacherDto> SubjectTeachers { get; set; } = new();
    }
}
