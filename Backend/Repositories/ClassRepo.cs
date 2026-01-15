using Backend.Data;
using Backend.Models;
using Backend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class ClassRepo:IClassRepo
    {
        private readonly AppDbContext _context;
        public ClassRepo(AppDbContext context)
        {
            _context = context;
        }

        public async Task CreateClass(Class clz)
        {
             _context.Classes.Add(clz);
            await _context.SaveChangesAsync();

        }

        public Task DeleteClass(Class clz)
        {
            throw new NotImplementedException();
        }

        public async Task<Class?> GetClass(int id)
        {
            return await _context.Classes.AsNoTracking().Include(c=>c.Grade).FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<List<Class>> GetClassByGrade(int gradeId)
        {
            return await _context.Classes.Include(c=>c.Grade).Where(c=>c.GradeId == gradeId).ToListAsync();
        }

        public Task UpdateClass(Class clz)
        {
            throw new NotImplementedException();
        }

        public async Task<bool> ClassNameExists(string className)
        {
            return await _context.Classes
                .AnyAsync(c => c.ClassName == className);
        }
    }
}
