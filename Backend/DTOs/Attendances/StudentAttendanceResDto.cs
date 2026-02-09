using Backend.Models;
using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs.Attendances
{
    public class StudentAttendanceResDto
    {
        public int Id { get; set; }

        [Required]
        public bool IsPresent { get; set; }

        public string? Reason { get; set; }

        [Required]
        public DateOnly Date { get; set; }

        [Required]
        public string? StudentName { get; set; }


        public string? ClassName { get; set; }

        public string? TeacherName {  get; set; }
    }
}
