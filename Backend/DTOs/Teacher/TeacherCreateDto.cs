using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs.Teacher
{
    public class TeacherCreateDto
    {
        [Required]
        public string? Username {  get; set; }
        [Required]
        [EmailAddress]
        public string? Email { get; set; }
        [Required]
        [Phone]
        public string? PhoneNumber { get; set; }
        [Required]
        public string? Password {  get; set; }
        [Required]
        public string? FullName { get; set; }
        [Required]
        [DataType(DataType.Date)]
        public DateOnly BirthDay { get; set; }
        [Required]
        public string? Address { get; set; }
        [Required]
        public string? City { get; set; }
        [Required]
        public string? Gender { get; set; } 
    }
}
