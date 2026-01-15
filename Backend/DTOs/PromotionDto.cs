namespace Backend.DTOs
{
    public class PromotionDto
    {
        public int StudentId {  get; set; }

        public int OldYearId {  get; set; }

        public int YearId { get; set; }

        public int GradeId {  get; set; }

        public int ClassId {  get; set; }

        public string? Status {  get; set; }
    }
}
