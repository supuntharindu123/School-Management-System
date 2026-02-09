using Backend.DTOs.Grade;
using Backend.Models;

namespace Backend.DTOs.Exam
{
    public class ExamDetailsResDto
    {
        public int Id { get; set; }

        public string? Title { get; set; }

        public string? Description { get; set; }

        public DateOnly StartDate { get; set; }

        public DateOnly EndDate { get; set; }

        public int AcademicYearId { get; set; }

        public ExamType ExamType { get; set; }

        public int TotalGrades {  get; set; }

        public int TotalStudents {  get; set; }

        public List<GradeExamResDto>? Grades { get; set; }

    }
}
