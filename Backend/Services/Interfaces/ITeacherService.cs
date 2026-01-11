using Backend.DTOs;

namespace Backend.Services.Interfaces
{
    public interface ITeacherService
    {
        public Task CreateTeacher(TeacherCreateDto dto);
    }
}
