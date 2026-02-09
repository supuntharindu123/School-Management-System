namespace Backend.DTOs.Grade
{
    public class GradeSummaryDto
    {
        public int GradeId { get; set; }
        public int? GradeName { get; set; }
        public int ClassCount { get; set; }
        public int StudentCount { get; set; }
    }
}
