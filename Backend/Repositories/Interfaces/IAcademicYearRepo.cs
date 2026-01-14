using Backend.Models;

namespace Backend.Repositories.Interfaces
{
    public interface IAcademicYearRepo
    {
        public Task<AcademicYear?> GetYearById(int id);
    }
}
