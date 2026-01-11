using Backend.Models;

namespace Backend.Repositories.Interfaces
{
    public interface ITeacherRepo
    {
        public Task AddTeacher(Teacher teacher);
    }
}
