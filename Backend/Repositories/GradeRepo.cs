using Backend.Data;
using Backend.Models;
using Backend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class GradeRepo:IGradeRepo
    {
        private readonly AppDbContext _context;
        public GradeRepo(AppDbContext context) {
            _context = context;
        }

        public Task AddGrade(Grade grade)
        {
            throw new NotImplementedException();
        }

        public async Task<Grade?> GradeById(int id)
        {
            return await _context.Grades.AsTracking().FirstOrDefaultAsync(g => g.Id == id);
            
        }
    }
}
