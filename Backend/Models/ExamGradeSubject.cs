namespace Backend.Models
{
    public class ExamGradeSubject
    {
        public int Id { get; set; }  

        public int ExamId {  get; set; }

        public int GradeId {  get; set; }

        public int SubjectId {  get; set; }

        public Exam? Exam { get; set; }

        public Grade? Grade { get; set; }

        public Subject? Subject { get; set; } 

    }
}
