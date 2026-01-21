using Backend.Models;

namespace Backend.Repositories.Interfaces
{
    public interface IClassRepo
    {
        public Task CreateClass(Class clz);
        public Task DeleteClass(Class clz);

        public Task UpdateClass(Class clz);

        public Task<Class?> GetClass(int id);

        public Task<List<Class>> GetClassByGrade(int gradeId);

        public Task<Class?> GetClassByIDs(int gradeId, int classNameId);

        public Task<string> NameOfClass(int gradeId, int classNameId);
    }
}
