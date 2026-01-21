using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class AcademicYear
    {
        public int Id { get; set; }

        [Required]
        public int Year { get; set; }

    }
}
