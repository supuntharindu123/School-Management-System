using Backend.Helper;
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
        public async Task<Result> CreateClass(Class clz)
        {
            var cl = await _repo.GetClassByIDs(clz.GradeId, clz.ClassNameID);

            if (cl!=null)
            {
                return Result.Failure("Class Already Exists");
            }

            await _repo.CreateClass(clz);

            return Result.Success();

        }

        public async Task<Result<IEnumerable<Class>>> GetClassByGrade(int gradeId)
        {
            var classes = await _repo.GetClassByGrade(gradeId);

            return Result<IEnumerable<Class>>.Success(classes);
        }


        public async Task<Result<Class>> GetClassById(int id)
        {
            var clz = await _repo.GetClass(id);
            if (clz == null)
            {
                return Result<Class>.Failure("Class Not Found");
            }

            return Result<Class>.Success(clz);
        }

        public async Task<Result> RemoveClass(int id)
        {
            var res = await _repo.GetClass(id);

            if (res == null)
            {
               return Result.Failure("Class Not Found");
            }

            await _repo.DeleteClass(res);

            return Result.Success();
        }

    }
}
