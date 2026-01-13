using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Student
    {
        public int Id { get; set; }
        [Required]
        public int UserId {  get; set; }
        [Required]
        public string? FullName { get; set; }
        [Required]
        [DataType(DataType.Date)]
        public DateOnly BirthDay {  get; set; }
        [Required]
        public string? Address {  get; set; }
        [Required]
        public string? City { get; set; }
        [Required]
        public string? Gender {  get; set; }
        [Required]
        public string? CurrentGrade {  get; set; }

        public User? user { get; set; }
    }
}
