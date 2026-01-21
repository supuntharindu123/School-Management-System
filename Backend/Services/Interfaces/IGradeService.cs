using Backend.Helper;
using Backend.Models;

namespace Backend.Services.Interfaces
{
    public interface IGradeService
    {
        public Task<Result<IEnumerable<Grade>>> GetAllGrades();
        public Task<Result<Grade>> GetGrade(int id);
    }
}
