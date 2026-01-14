using Backend.Data;
using Backend.Models;
using Backend.Repositories.Interfaces;

namespace Backend.Repositories
{
    public class ClassRepo:IClassRepo
    {
        private readonly AppDbContext _context;
        public ClassRepo(AppDbContext context)
        {
            _context = context;
        }

        public Task CreateClass(Class clz)
        {
            throw new NotImplementedException();
        }

        public Task DeleteClass(Class clz)
        {
            throw new NotImplementedException();
        }

        public Task<Class> GetClass(int id)
        {
            throw new NotImplementedException();
        }

        public Task<List<Class>> GetClassByGrade(int gradeId)
        {
            throw new NotImplementedException();
        }

        public Task UpdateClass(Class clz)
        {
            throw new NotImplementedException();
        }
    }
}
