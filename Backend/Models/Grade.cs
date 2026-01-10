using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Grade
    {
        public int Id { get; set; }

        [Required]
        public string? GradeName { get; set; }
    }
}
