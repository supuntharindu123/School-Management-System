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
            clz.Name = await NameOfClass(clz.GradeId, clz.ClassNameID);
             _context.Classes.Add(clz);
            await _context.SaveChangesAsync();

        }

        public async Task DeleteClass(Class clz)
        {
           _context.Classes.Remove(clz);
            await _context.SaveChangesAsync();
        }

        public async Task<Class?> GetClass(int id)
        {
            return await _context.Classes.AsNoTracking().Include(c=>c.Grade).Include(c=>c.ClassName).FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<List<Class>> GetClassByGrade(int gradeId)
        {
            return await _context.Classes.Include(c=>c.Grade).Include(c => c.ClassName).Where(c=>c.GradeId == gradeId).ToListAsync();
        }

        public Task UpdateClass(Class clz)
        {
            throw new NotImplementedException();
        }

        public async Task<Class?> GetClassByIDs(int gradeId, int classNameId)
        {
            return await _context.Classes.AsNoTracking()
                .FirstOrDefaultAsync(c=>c.GradeId==gradeId && c.ClassNameID==classNameId);
        }

        public async Task<string> NameOfClass(int gradeId, int classNameId)
        {
            var grade=await _context.Grades.FirstOrDefaultAsync(g=>g.Id == gradeId);

            var name = await _context.ClassNames.FirstOrDefaultAsync(c => c.Id == classNameId);

            return ("Grade"+grade!.GradeName + "-" + name!.Name);
        }
    }
}
