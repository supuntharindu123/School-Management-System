using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Backend.Models
{
    public class Class
    {
        public int Id { get; set; }
        [Required]
        public int GradeId {  get; set; }
        [JsonIgnore]
        public Grade? Grade { get; set; }
        [Required]
        public int ClassNameID { get; set; }
        [JsonIgnore]
        public ClassName? ClassName {  get; set; }

        public string? Name {  get; set; }
        [JsonIgnore]
        public ICollection<Student>? Students {  get; set; }
        [JsonIgnore]
        public ICollection<StudentAcademicHistory>? StudentsHistory { get; set; }
        [JsonIgnore]
        public ICollection<TeacherClassAssign>? TeacherClassAssign {  get; set; }
        [JsonIgnore]
        public ICollection<TeacherSubjectClass>? TeacherSubjectClass { get; set; }

        public ICollection<Marks>? Marks { get; set; }
    }
}
