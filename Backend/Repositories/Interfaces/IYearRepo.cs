using Backend.Models;

namespace Backend.Repositories.Interfaces
{
    public interface IYearRepo
    {
        public Task<AcademicYear?> GetYearById(int yearId);

        public Task<List<AcademicYear>> GetYearList();
    }
}
