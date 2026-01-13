using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs
{
    public class TeacherUpdateDto
    {
        [Required]
        public string? FullName { get; set; }
        [Required]
        public string? Address { get; set; }
        [Required]
        public string? City { get; set; }
        [Required]
        public string? Gender { get; set; }
    }
}
