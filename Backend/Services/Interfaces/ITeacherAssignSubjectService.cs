using Backend.DTOs;
using Backend.Helper;
using Backend.Models;

namespace Backend.Services.Interfaces
{
    public interface ITeacherAssignSubjectService
    {
        public Task<Result> AssignSubject(AssignTeacherSubjectDto teacherSubjectClass);

        public Task<Result<List<AssignTeacherSubjectResDto>>> GetAll();

        public Task<Result<List<AssignTeacherSubjectResDto>>> GetByTeacher(int id);

        public Task<Result> RemovePermission(int id);

        public Task<Result> Update(int id,AssignTeacherSubjectDto teacherSubjectClass);

        public Task<Result<AssignTeacherSubjectResDto?>> GetById(int id);
    }
}
