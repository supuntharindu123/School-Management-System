using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs
{
    public class StudentCreateDto
    {
        [Required]
        public string? Username { get; set; }
        [Required]
        [EmailAddress]
        public string? Email { get; set; }
        [Required]
        [Phone]
        public string? PhoneNumber { get; set; }
        [Required]
        public string? Password { get; set; }
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
        [Required]
        public int ClassNameId { get; set; }
        public int AcademicYearId { get; set; }
        [Required]
        public int GradeId { get; set; }
        [Required]
        public string? GuardianName { get; set; }

        public string? GuardianRelation { get; set; }
        [Required]
        public DateOnly GuardianDate { get; set; }
    }
}
