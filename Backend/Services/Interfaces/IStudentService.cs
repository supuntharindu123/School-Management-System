using Backend.DTOs;

namespace Backend.Services.Interfaces
{
    public interface IStudentService
    {
        public Task CreateStudent(StudentCreateDto dto);
        public Task<List<StudentRes>> AllStudents();

        public Task<StudentRes> StudentById(int id);

        public Task DeleteStudent(int id);

        public Task UpdateStudent(int id,StudentUpdateDto dto);
    }
}
