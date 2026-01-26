using Backend.DTOs;
using Backend.Helper;

namespace Backend.Services.Interfaces
{
    public interface ITeacherService
    {
        public Task<Result> CreateTeacher(TeacherCreateDto dto);

        public Task<Result> UpdateTeacher(int id,TeacherUpdateDto dto);

        public Task<Result> DeleteTeacher(int id);

        public Task<Result<IEnumerable<TeacherResponseDto>>> GetAllTeachers();

        public Task<Result<TeacherResponseDto>> GetTeacher(int id);
    }
}
