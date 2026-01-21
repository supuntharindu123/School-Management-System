using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Student
    {
        public int Id { get; set; }
        [Required]
        public int UserId {  get; set; }
        [Required]
        public string? StudentIDNumber {  get; set; }
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
        public int ClassId { get; set; }
        [Required]
        public string? GuardianName { get; set; }

        public string? GuardianRelation { get; set; }
        [Required]
        public DateOnly GuardianDate { get; set; }

        public DateOnly? ResignDate { get; set; }

        public string? Status { get; set; } = "Active";
        public User? User { get; set; }

        public Class? Class { get; set; }

        public ICollection<StudentAcademicHistory>? AcademicHistory { get; set; }

        public ICollection<StudentAttendances>? StudentAttendances { get; set; }

        public ICollection<Marks>? Marks { get; set; }

    }
}
