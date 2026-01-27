using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs
{
    public class SubjectGradeCreateDto
    {
        [Required]
        public int SubjectId { get; set; }

        [Required]
        public int GradeId { get; set; }

    }
}
