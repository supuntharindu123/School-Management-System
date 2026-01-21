using Backend.DTOs;
using Backend.Helper;

namespace Backend.Services.Interfaces
{
    public interface ITeacherService
    {
        public Task<Result> CreateTeacher(TeacherCreateDto dto);

        public Task<Result> UpdateTeacher(int id,TeacherUpdateDto dto);

        public Task<Result> DeleteTeacher(int id);

        public Task<Result<IEnumerable<TeacherRes>>> GetAllTeachers();

        public Task<Result<TeacherRes>> GetTeacher(int id);
    }
}
