using Backend.Models;
using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs.Attendances
{
    public class StudentAttendanceUpdateDto
    {
        public bool IsPresent { get; set; }

        public string? Reason { get; set; }

        public DateOnly Date { get; set; }

        public int StudentId { get; set; }

        public int TeacherId { get; set; }
    }
}
