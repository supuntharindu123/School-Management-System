using Backend.Models;
using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs.User
{
    public class RegisterDto
    {
        [Required]
        [MaxLength(100)]
        public string? Username { get; set; }
        [Required]
        [MaxLength(100)]
        [EmailAddress]
        public string? Email { get; set; }
        [Required]  
        [MaxLength(15)]
        [Phone]
        public string? PhoneNumber { get; set; }
        [Required]
        public string? Password { get; set; }
        [Required]
        public UserRole Role { get; set; }
    }
}
