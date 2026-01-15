using Backend.DTOs;
using Backend.Models;

namespace Backend.Repositories.Interfaces
{
    public interface IStudentHistoryRepo
    {
        public Task<StudentAcademicHistory?> GetById(int studentid,int yearid);
        public Task AddStudentHistory(StudentAcademicHistory dto);
        public Task UpdateStudentHistory(StudentAcademicHistory dto);
    }
}
