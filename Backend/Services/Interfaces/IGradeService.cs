using Backend.Helper;
using Backend.Models;
using Backend.DTOs.Grade;

namespace Backend.Services.Interfaces
{
    public interface IGradeService
    {
        public Task<Result<IEnumerable<Grade>>> GetAllGrades();
        public Task<Result<Grade>> GetGrade(int id);
        public Task<Result<IEnumerable<GradeSummaryDto>>> GetSummaries();
    }
}
