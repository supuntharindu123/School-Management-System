using Backend.Models;

namespace Backend.Services.Interfaces
{
    public interface IGradeService
    {
        public Task<List<Grade>> GetAllGrades();
        public Task<Grade> GetGrade(int id);
    }
}
