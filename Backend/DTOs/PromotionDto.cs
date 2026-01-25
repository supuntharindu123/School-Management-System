namespace Backend.DTOs
{
    public class PromotionDto
    {
        public int StudentId {  get; set; }

        public int GradeId {  get; set; }

        public int ClassId {  get; set; }

        public int AcademicYearId {  get; set; }

        public string? Status {  get; set; }

        public string? Description { get; set; }
    }
}
