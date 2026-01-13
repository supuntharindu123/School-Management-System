using Backend.DTOs;

namespace Backend.Services.Interfaces
{
    public interface ITeacherService
    {
        public Task CreateTeacher(TeacherCreateDto dto);

        public Task UpdateTeacher(int id,TeacherUpdateDto dto);

        public Task DeleteTeacher(int id);

        public Task<List<TeacherRes>> GetAllTeachers();

        public Task<TeacherRes> GetTeacher(int id);
    }
}
