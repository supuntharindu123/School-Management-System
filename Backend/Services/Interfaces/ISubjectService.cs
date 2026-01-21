using Backend.Helper;
using Backend.Models;

namespace Backend.Services.Interfaces
{
    public interface ISubjectService
    {
        public Task<Result> AddSubject(Subject subject);

        public Task<Result> RemoveSubject(int id);

        public Task<Result> UpdateSubject(int id,Subject subject);

        public Task<Result<IEnumerable<Subject>>> GetSubjects();

        public Task<Result<Subject>> GetSubjectByID(int id);

    }
}
