using Backend.DTOs.Grade;
using Backend.Models;
using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs.Subject
{
    public class SubjectGradeResDto
    {
        public int Id {  get; set; }

        public string? ModuleCode { get; set; }

        public string? SubjectName { get; set; }

        public List<GradeResDto>? Grades { get; set; }



    }
}
