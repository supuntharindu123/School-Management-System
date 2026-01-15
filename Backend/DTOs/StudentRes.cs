using Backend.Models;
using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs
{
    public class StudentRes
    {
        public int Id { get; set; }
        public int UserId {  get; set; }
        public string? Username { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public string? FullName { get; set; }
        public DateOnly BirthDay { get; set; }
        public string? Address { get; set; }
        public string? City { get; set; }
        public string? Gender { get; set; }
        public int CurrentGradeID { get; set; }
        public int CurrentClassID { get; set; }
        public int CurrentYearID { get; set; }
        public string? GuardianName { get; set; }
        public string? GuardianRelation { get; set; }
        public DateOnly GuardianDate { get; set; }
        public DateOnly? ResignDate { get; set; }
        public UserRole Role { get; set; }
    }
}
