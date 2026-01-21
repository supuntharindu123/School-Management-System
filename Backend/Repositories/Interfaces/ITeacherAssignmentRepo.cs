using Backend.Models;

namespace Backend.Repositories.Interfaces
{
    public interface ITeacherAssignmentRepo
    {
        public Task CreateAssignment(TeacherClassAssign task);

        public Task<TeacherClassAssign?> AssignmentById(int TeacherId);

        public Task<List<TeacherClassAssign>> GetAssignmentFromTeacher(int TeacherId);

        public Task<TeacherClassAssign?> AssignmentByClass(int ClassId);

    }
}
