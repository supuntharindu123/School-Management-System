using Backend.DTOs.Teacher;
using Backend.Helper;
using Backend.Models;

namespace Backend.Services.Interfaces
{
    public interface ITeacherAssignmentService
    {
        public Task<Result> CreateAssignmentTask(TeacherClassAssignDto task);

        public Task<Result<TeacherClassRes>> AssignmentById(int id);

        public Task<Result<IEnumerable<TeacherClassRes>>> AssignmentBYTeacher(int id);

        public Task<Result<TeacherClassRes?>> AssignmentByClass(int ClassId);

        public Task<Result> AssignmentTerminate(int id);
    }
}
