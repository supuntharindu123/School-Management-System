using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs.Subject
{
    public class SubjectResDto
    {
        public int Id { get; set; }

        public string? ModuleCode { get; set; }

        public string? SubjectName { get; set; }
    }
}
