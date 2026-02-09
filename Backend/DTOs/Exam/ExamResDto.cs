using Backend.Models;

namespace Backend.DTOs.Exam
{
    public class ExamResDto
    {
        public int Id { get; set; }

        public string? Title { get; set; }

        public string? Description { get; set; }

        public DateOnly StartDate { get; set; }

        public DateOnly EndDate { get; set; }

        public int AcademicYear { get; set; }
       
        public string? ExamType { get; set; }

      

    }
}
