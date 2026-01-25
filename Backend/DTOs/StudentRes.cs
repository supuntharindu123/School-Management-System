using Backend.Models;
using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs
{
    public class StudentRes
    {
        public int Id { get; set; }
        public int UserId {  get; set; }
        public string? StudentIDNumber { get; set; }
        public string? Username { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public string? FullName { get; set; }
        public DateOnly BirthDay { get; set; }
        public string? Address { get; set; }
        public string? City { get; set; }
        public string? Gender { get; set; }
        public string? CurrentClass { get; set; }
        public int? AcademicYearId { get; set; }
        public string? Status {  get; set; }
        public string? CurrentGrade {  get; set; }
        public string? GuardianName { get; set; }
        public string? GuardianRelation { get; set; }
        public DateOnly GuardianDate { get; set; }
        public DateOnly? ResignDate { get; set; }
        public UserRole Role { get; set; }

    }
}
