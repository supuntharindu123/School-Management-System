using Backend.Models;
using Backend.Repositories.Interfaces;
using Backend.Services.Interfaces;

namespace Backend.Services
{
    public class YearService : IYearService
    {
        private readonly IYearRepo _repo;

        public YearService(IYearRepo repo)
        {
            _repo = repo; 
        }
        public async Task<List<AcademicYear>> GetAcademicYears()
        {
            return await _repo.GetYearList();
        }

        public async Task<AcademicYear?> GetYear(int id)
        {
            return await _repo.GetYearById(id);
        }
    }
}
