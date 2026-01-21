namespace Backend.Models
{
    public class TeacherSubjectTask
    {
        public int Id { get; set; }

        public DateTime StartDate {  get; set; }

        public DateTime EndDate { get; set; }

        public bool IsActive {  get; set; }

        public string? Description {  get; set; }

        public int TeacherSubjectClassId {  get; set; }

        public TeacherSubjectClass? TeacherSubjectClass { get; set; }
    }
}
