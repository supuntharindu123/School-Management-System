using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class SubjectGrade
    {
        public int Id { get; set; }

        [Required]
        public int SubjectId{get; set; }

        public Subject? Subject { get; set; }

        [Required]
        public int GradeID {  get; set; }

        public Grade? Grade { get; set; }
    }
}
