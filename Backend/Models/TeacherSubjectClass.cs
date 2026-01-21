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

        public Teacher? Teacher { get; set; }

        public Subject? Subject { get; set; }

        public Class? Class { get; set; }

        public ICollection<TeacherSubjectTask>? TeacherSubjectTask {  get; set; }

        public ICollection<Marks>? Marks { get; set; }
    }
}
