using Backend.Helper;
using Backend.Models;

namespace Backend.Repositories.Interfaces
{
    public interface ISubjectRepo
    {
        public Task AddSubject(Subject subject);

        public Task<List<Subject>> GetSubjects();

        public Task DeleteSubject (Subject subject);

        public Task UpdateSubject (Subject subject);

        public Task<Subject?> GetSubjectById (int id);

        public Task<Subject?> SubjectExists(Subject subject);
    }
}
