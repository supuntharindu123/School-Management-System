namespace Backend.Models
{
    public class ExamGrade
    {
        public int Id { get; set; }

        public int ExamId {  get; set; }

        public int GradeId {  get; set; }

        public Exam? Exam { get; set; }  

        public Grade? Grade { get; set; }
    }
}
