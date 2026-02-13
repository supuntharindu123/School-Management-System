using Backend.Models;

namespace Backend.DTOs.Marks
{
    public class MarkResDto
    {
        public int Id { get; set; }

        public string? Score { get; set; }

        public bool IsPresent { get; set; }

        public string? Reason { get; set; }

        public int StudentId { get; set; }

        public string? StudentName { get; set; }

        public int GradeId { get; set; }

        public int ClassId { get; set; }

        public int ExamId { get; set; }

        public int TeacherId { get; set; }

        public int SubjectId {  get; set; }

        public int AcademicYearId {  get; set; }

        public string? StudentIDNumber { get; set; }

    }
}
