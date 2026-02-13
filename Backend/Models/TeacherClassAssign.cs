using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class TeacherClassAssign
    {
        public int Id { get; set; }

        [Required]
        public int TeacherId { get; set; }

        public Teacher? Teacher { get; set; }

        public string? Description {  get; set; }
        [Required]
        public bool IsActive {  get; set; }

        public DateTime CreatedDate { get; set; }

        public DateTime UpdatedDate { get;set; }

        public string? Role {  get; set; }

        [Required]
        public int ClassId {  get; set; }

        public Class? Class { get; set; }
    }
}
