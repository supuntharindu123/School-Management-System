using Backend.Helper;
using Backend.Models;

namespace Backend.Services.Interfaces
{
    public interface IClassService
    {
        public Task<Result> CreateClass(Class clz);
        public Task<Result<Class>> GetClassById(int id);
        public Task<Result<IEnumerable<Class>>> GetClassByGrade(int GradeId);

        public Task<Result> RemoveClass(int id);

    }
}
