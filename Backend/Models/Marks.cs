namespace Backend.Models
{
    public class Marks
    {
        public int Id { get; set; }

        public string? Score {  get; set; }

        public bool IsPresent {  get; set; }

        public string? Reason {  get; set; }

        public int StudentId {  get; set; }

        public Student? Student { get; set; }

        public int GradeId {  get; set; }

        public Grade? Grades {  get; set; }

        public int ClassId {  get; set; }

        public Class? Class { get; set; }

        public int ExamId {  get; set; }

        public Exam? Exam { get; set; }

        public int TeacherId {  get; set; }

        public Teacher? Teacher { get; set; }


    }
}
