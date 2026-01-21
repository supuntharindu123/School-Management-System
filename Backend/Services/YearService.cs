using Backend.Helper;
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
        public async Task<Result<IEnumerable<AcademicYear>>> GetAcademicYears()
        {
            return Result<IEnumerable<AcademicYear>>.Success(await _repo.GetYearList());
        }

        public async Task<Result<AcademicYear?>> GetYear(int id)
        {
            return Result<AcademicYear?>.Success(await _repo.GetYearById(id));
        }
    }
}
