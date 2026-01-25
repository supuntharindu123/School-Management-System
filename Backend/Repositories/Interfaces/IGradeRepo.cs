using Backend.Models;
using Backend.DTOs;

namespace Backend.Repositories.Interfaces
{
    public interface IGradeRepo
    {
        public Task AddGrade(Grade grade);
        public Task<Grade?> GradeById(int id);

        public Task<List<Grade>> GetGrades();
        public Task<List<GradeSummaryDto>> GetGradeSummaries();
    }
}
