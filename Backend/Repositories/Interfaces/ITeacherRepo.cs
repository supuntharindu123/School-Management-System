using Backend.Models;

namespace Backend.Repositories.Interfaces
{
    public interface ITeacherRepo
    {
        public Task AddTeacher(Teacher teacher);

        public Task<List<Teacher>> GetTeachers();

        public Task<Teacher?> GetTeacherById(int id);

        public Task DeleteTeacher(Teacher teacher);

        public Task UpdateTeacher(Teacher teacher);


    }
}
