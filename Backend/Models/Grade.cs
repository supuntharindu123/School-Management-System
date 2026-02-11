using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Grade
    {
        public int Id { get; set; }

        [Required]
        public int? GradeName { get; set; }

        public ICollection<SubjectGrade>? SubjectGrade {  get; set; }

        public ICollection<Marks>? Marks { get; set; }

        public ICollection<Class>? Classes { get; set; }

        public ICollection<ExamGrade>? ExamGrades {  get; set; }

        public ICollection<ExamGradeSubject>? ExamGradeSubjects {  get; set; }
    }
}
