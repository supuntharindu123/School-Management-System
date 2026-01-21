using Backend.Helper;
using Backend.Models;

namespace Backend.Services.Interfaces
{
    public interface IYearService
    {
        public Task<Result<AcademicYear?>> GetYear(int id);

        public Task<Result<IEnumerable<AcademicYear>>> GetAcademicYears();
    }
}
