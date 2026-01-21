using Backend.Models;
using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs
{
    public class TeacherClassRes
    {
        public int Id { get; set; }

        public int TeacherId { get; set; }

        public string? TeacherName {  get; set; }

        public string? Description { get; set; }

        public bool IsActive { get; set; }

        public DateTime? CreatedDate { get; set; }

        public DateTime? UpdatedDate { get; set; }

        public string? Role { get; set; }

        [Required]
        public int ClassId { get; set; }

        public string? ClassName { get; set; }
    }
}
