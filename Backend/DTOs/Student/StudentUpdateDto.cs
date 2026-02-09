using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs.Student
{
    public class StudentUpdateDto
    {
    
        public string? Address { get; set; }
        
        public string? City { get; set; }
      
        public string? Gender { get; set; }
      
        public string? GuardianName { get; set; }

        public string? GuardianRelation { get; set; }
    }
}
