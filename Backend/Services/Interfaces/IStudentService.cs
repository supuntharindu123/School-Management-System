using Backend.DTOs;
using Backend.Helper;

namespace Backend.Services.Interfaces
{
    public interface IStudentService
    {
        public Task<Result> CreateStudent(StudentCreateDto dto);
        public Task<Result<IEnumerable<StudentRes>>> AllStudents();

        public Task<Result<StudentRes>> StudentById(int id);

        public Task<Result> DeleteStudent(int id);

        public Task<Result> UpdateStudent(int id,StudentUpdateDto dto);

        public byte[] ExportToExcel(List<StudentRes> studentRes);

    }
}
