namespace Backend.Models
{
    public class Exam
    {
        public int Id { get; set; }

        public string? Title {  get; set; }

        public string? Description { get; set; }

        public DateOnly StartDate {  get; set; }

        public DateOnly EndDate { get; set; }

        public int AcademicYearId {  get; set; }
        public AcademicYear? AcademicYear { get; set; }

        public int GradeId {  get; set; }

        public Grade? Grade { get; set; }

        public ICollection<Marks>? Marks { get; set; }
    }
}
