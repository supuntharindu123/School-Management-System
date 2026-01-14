using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Class
    {
        public int Id { get; set; }

        [Required]
        public int GradeId {  get; set; }
        public Grade? Grade { get; set; }

        [Required]
        public string? ClassName { get; set; }

        [Required]
        public int YearId { get; set; }
        public AcademicYear? AcademicYear { get; set; }


    }
}
