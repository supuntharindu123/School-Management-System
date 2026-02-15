using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class StudentAttendances
    {
        public int Id { get; set; }

        [Required]
        public bool IsPresent {  get; set; }

        public string? Reason {  get; set; }

        [Required]
        public DateOnly Date {  get; set; }

        public int ClassId {  get; set; }

        [Required]
        public int StudentId {  get; set; }


        public Student? Student { get; set; }

        public int TeacherId {  get; set; }

        public Teacher? Teacher { get; set; }
    }
}
