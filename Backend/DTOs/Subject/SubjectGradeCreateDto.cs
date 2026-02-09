using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs.Subject
{
    public class SubjectGradeCreateDto
    {
        [Required]
        public int SubjectId { get; set; }

        [Required]
        public int GradeId { get; set; }

    }
}
