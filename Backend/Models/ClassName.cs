using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class ClassName
    {
        public int Id { get; set; }
        [Required]
        public string? Name { get; set; }

        public ICollection<Class>? Classes { get; set; }
    }
}
