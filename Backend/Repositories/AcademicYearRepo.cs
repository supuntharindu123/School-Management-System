using Backend.Data;
using Backend.Models;
using Backend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class AcademicYearRepo : IAcademicYearRepo
    {
        private readonly AppDbContext _context;
        public AcademicYearRepo(AppDbContext context)
        {
            _context = context;
        }
        public async Task<AcademicYear?> GetYearById(int id)
        {
            return await _context.AcademicYears.AsNoTracking().FirstOrDefaultAsync(y=>y.Id == id);
        }
    }
}
