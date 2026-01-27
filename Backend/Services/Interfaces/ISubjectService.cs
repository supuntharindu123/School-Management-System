using Backend.DTOs;
using Backend.Helper;
using Backend.Models;

namespace Backend.Services.Interfaces
{
    public interface ISubjectService
    {
        public Task<Result> AddSubject(Subject subject);

        public Task<Result> RemoveSubject(int id);

        public Task<Result> UpdateSubject(int id,Subject subject);

        public Task<Result<List<SubjectGradeResDto>>> GetSubjects();

        public Task<Result<SubjectGradeResDto>> GetSubjectByID(int id);

    }
}
