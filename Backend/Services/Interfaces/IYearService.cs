using Backend.Models;

namespace Backend.Services.Interfaces
{
    public interface IYearService
    {
        public Task<AcademicYear?> GetYear(int id);

        public Task<List<AcademicYear>> GetAcademicYears();
    }
}
