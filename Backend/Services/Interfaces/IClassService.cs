using Backend.Models;

namespace Backend.Services.Interfaces
{
    public interface IClassService
    {
        public Task CreateClass(Class clz);
        public Task<Class?> GetClassById(int id);
        public Task<List<Class>> GetClassByGrade(int GradeId);

    }
}
