using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Subject
    {
        public int Id {  get; set; }

        [Required]
        public string ? ModuleCode { get; set; }

        [Required]
        public string ? SubjectName {  get; set; }

        [Required]
        public string? GradeId {  get; set; }
    }
}
