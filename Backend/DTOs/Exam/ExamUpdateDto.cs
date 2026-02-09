using Backend.Models;

namespace Backend.DTOs.Exam
{
    public class ExamUpdateDto
    {

        public string? Title { get; set; }

        public string? Description { get; set; }

        public DateOnly StartDate { get; set; }

        public DateOnly EndDate { get; set; }

        public int AcademicYearId { get; set; }

        public int GradeId { get; set; }

    }
}
