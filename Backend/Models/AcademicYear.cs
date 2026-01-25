using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class AcademicYear
    {
        public int Id { get; set; }

        [Required]
        public int Year { get; set; }

        public ICollection<Exam>? Exams { get; set; }

        public ICollection<Student>? students { get; set; }

        public ICollection<StudentAcademicHistory>? studentAcademicHistories { get; set; }

    }
}
