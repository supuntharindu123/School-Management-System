using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Subject
    {
        public int Id {  get; set; }

        [Required]
        public string ? ModuleCode { get; set; }

        [Required]
        public string ? SubjectName {  get; set; }

        public ICollection<SubjectGrade>? SubjectGrade {  get; set; }

        public ICollection<ExamGradeSubject>? ExamGradeSubjects {  get; set; }

        public ICollection<TeacherSubjectClass>? TeacherSubjectClass {  get; set; }



    }
}
