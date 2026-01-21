using Backend.DTOs;
using Backend.Models;

namespace Backend.Repositories.Interfaces
{
    public interface IStudentHistoryRepo
    {
        public Task<StudentAcademicHistory?> GetById(int studentid);
        public Task AddStudentHistory(StudentAcademicHistory dto);
        public Task UpdateStudentHistory(StudentAcademicHistory dto);
    }
}
