namespace Backend.Models
{
    public class SubjectGrade
    {
        public int Id { get; set; }

        public int SubjectId{get; set; }

        public Subject? Subject { get; set; }

        public int GradeID {  get; set; }

        public Grade? Grade { get; set; }
    }
}
