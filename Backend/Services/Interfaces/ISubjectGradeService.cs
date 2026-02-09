using Backend.DTOs.Subject;
using Backend.Helper;
using Backend.Models;

namespace Backend.Services.Interfaces
{
    public interface ISubjectGradeService
    {
        public Task<Result> Add(List<SubjectGradeCreateDto> subjectGrade);

        public Task<Result> Remove(int id);

        public Task<Result<SubjectGrade>> GetById(int id);

        public Task<Result<List<SubjectGrade>>> GetByGrade(int id);
    }
}
