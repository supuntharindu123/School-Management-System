using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs
{
    public class StudentUpdateDto
    {
        [Required]
        public string? FullName { get; set; }
        [Required]
        public string? Address { get; set; }
        [Required]
        public string? City { get; set; }
        [Required]
        public string? Gender { get; set; }
        [Required]
        public string? CurrentGrade { get; set; }
    }
}
