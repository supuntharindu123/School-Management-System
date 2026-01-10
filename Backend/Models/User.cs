using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class User
    {
        public int Id { get; set; }
        [Required]
        [MaxLength(100)]
        public string ? Username { get; set; }
        [Required]
        [MaxLength(100)]
        [EmailAddress]
        public string ? Email { get; set; }
        [Required]
        [MaxLength(15)]
        [Phone]
        public string ? PhoneNumber {  get; set; }
        [Required]
        public string ? Password { get; set; }
        [Required]
        public string ? Role { get; set; }
        public DateTime CreateAt {  get; set; }

    }
}
