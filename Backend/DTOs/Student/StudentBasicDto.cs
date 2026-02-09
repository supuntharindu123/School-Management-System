namespace Backend.DTOs.Student
{
    public class StudentBasicDto
    {
        public int Id { get; set; }
        public string? StudentIDNumber { get; set; }
        public string? FullName { get; set; }
        public string? Gender { get; set; }
        public string? Status { get; set; }
    }
}
