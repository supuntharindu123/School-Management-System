namespace Backend.DTOs.Exam
{
    public class AssignExamGradeReqDto
    {
        public int ExamId { get; set; }
        public List<int>? GradeIds { get; set; }
    }
}
