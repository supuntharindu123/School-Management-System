using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs
{
    public class TeacherUpdateDto
    {

        public string? FullName { get; set; }

        [DataType(DataType.Date)]
        public DateOnly BirthDay { get; set; }

        public string? Address { get; set; }

        public string? City { get; set; }

        public string? Gender { get; set; }
    }
}
