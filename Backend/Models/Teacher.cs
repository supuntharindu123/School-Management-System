using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Teacher
    {
        public int Id { get; set; }

        [Required]
        public int UserId {  get; set; }

        [Required]
        public string? FullName { get; set; }

        [Required]
        [DataType(DataType.Date)]
        public DateOnly BirthDay { get; set; }

        [Required]
        public string ? Address {  get; set; }

        [Required]
        public string ? City { get; set; }

        [Required]
        public string ? Gender {  get; set; }

        [Required]
        public User? User {  get; set; }

        public ICollection<Marks> Marks { get; set; }

        public ICollection<TeacherClassAssign> AssignTasks { get; set; }

        public ICollection<TeacherSubjectClass>? TeacherSubjectClass { get; set; }

        public ICollection<StudentAttendances>? StudentAttendances { get; set; }
    }
}
