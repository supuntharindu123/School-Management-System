using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class TeacherSubjectClass
    {
        public int Id { get; set; }
        [Required]
        public int TeacherId {  get; set; }
        [Required]
        public int SubjectId { get; set; }
        [Required]
        public int ClassId { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public bool IsActive { get; set; }

        public string? Description { get; set; }

        public Teacher? Teacher { get; set; }

        public Subject? Subject { get; set; }

        public Class? Class { get; set; }

        public ICollection<Marks>? Marks { get; set; }
    }
}
