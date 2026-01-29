using Backend.Models;
using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs
{
    public class TeacherClassAssignDto
    {
        [Required]
        public int TeacherId { get; set; }

        public string? Description { get; set; }

        public string? Role { get; set; }

        [Required]
        public int ClassId { get; set; }
    }
}
