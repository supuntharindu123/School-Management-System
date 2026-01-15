using Backend.Data;
using Backend.Models;
using Backend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class YearRepo : IYearRepo
    {
        private readonly AppDbContext _context;

        public YearRepo (AppDbContext context)
        {
            _context = context;
        }
        public async Task<AcademicYear?> GetYearById(int yearId)
        {
            return await _context.AcademicYears.AsNoTracking().FirstOrDefaultAsync(y=> y.Id== yearId);
        }

        public async Task<List<AcademicYear>> GetYearList()
        {
            return await _context.AcademicYears.ToListAsync();
        }
    }
}
