using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class StudentAcademicHistory
    {
        public int Id { get; set; }

        [Required]
        public int ClassId {  get; set; }

        public Class? Class { get; set; }

        [Required]
        public DateTime StartDate {  get; set; }

        public DateTime? EndDate { get; set; }

        public string? Status {  get; set; }

        [Required]
        public int StudentId { get; set; }

        public Student? Student { get; set; }


    }
}
