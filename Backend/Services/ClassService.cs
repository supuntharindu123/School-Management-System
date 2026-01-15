using Backend.Models;
using Backend.Repositories.Interfaces;
using Backend.Services.Interfaces;

namespace Backend.Services
{
    public class ClassService : IClassService
    {
        private readonly IClassRepo _repo;

        public ClassService(IClassRepo repo)
        {
            _repo = repo; 
        }
        public async Task CreateClass(Class clz)
        {
            var cl = await _repo.ClassNameExists(clz.ClassName);

            if (cl)
            {
                throw new Exception("Class Already Exists");
            }

            await _repo.CreateClass(clz);

        }

        public async Task<List<Class>> GetClassByGrade(int GradeId)
        {
            var classes=await _repo.GetClassByGrade(GradeId);
            return classes;
        }

        public async Task<Class?> GetClassById(int id)
        {
            var clz = await _repo.GetClass(id);
            return clz;
        }
    }
}
