namespace Backend.DTOs.Exam
{
    public class AssignExamGradeSubjectReqDto
    {
        public int ExamId { get; set; }
        public int GradeId { get; set; }
        public List<int>? SubjectIds { get; set; }
    }
}
