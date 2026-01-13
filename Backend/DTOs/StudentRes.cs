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
        public string? CurrentGrade { get; set; }
        public UserRole Role { get; set; }
    }
}
