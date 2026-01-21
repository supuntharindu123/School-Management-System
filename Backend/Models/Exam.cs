namespace Backend.Models
{
    public class Exam
    {
        public int Id { get; set; }

        public string? Title {  get; set; }

        public string? Description { get; set; }

        public DateOnly StartDate {  get; set; }

        public DateOnly EndDate { get; set; }

        public ICollection<Marks>? Marks { get; set; }
    }
}
