using Backend.DTOs.Subject;
using Backend.Models;

namespace Backend.DTOs.Exam
{
    public class GradeExamResDto
    {
        public int GradeId { get; set; }

        public int TotalClasses { get; set; }

        public int TotalStudents { get; set; }

        public List<Class>? Classes { get; set; }

        public List<SubjectResDto>? Subjects { get; set; }
    }
}
