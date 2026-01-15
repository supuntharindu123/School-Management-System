using Backend.Models;

namespace Backend.Repositories.Interfaces
{
    public interface IGradeRepo
    {
        public Task AddGrade(Grade grade);
        public Task<Grade?> GradeById(int id);

        public Task<List<Grade>> GetGrades();
    }
}
