using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class StudentAcademicHistory
    {
        public int Id { get; set; }
        [Required]
        public int StudentID {  get; set; }
        [Required]
        public int GradeId {  get; set; }
        [Required]
        public int ClassId {  get; set; }
        [Required]
        public int YearId {  get; set; }
        [Required]
        public DateTime StartDate {  get; set; }

        public DateTime? EndDate { get; set; }

        public string? Status {  get; set; }
        
        public Student? student { get; set; }


    }
}
