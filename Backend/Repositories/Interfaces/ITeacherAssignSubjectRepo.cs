using Backend.Models;

namespace Backend.Repositories.Interfaces
{
    public interface ITeacherAssignSubjectRepo
    {
        public Task AssignSubject(TeacherSubjectClass teacherSubjectClass);

        public Task<List<TeacherSubjectClass>> GetAll();

        public Task<List<TeacherSubjectClass>> GetByTeacher(int id);

        public Task RemovePermission(TeacherSubjectClass teacherSubjectClass);

        public Task Update();

        public Task<TeacherSubjectClass?> GetById(int id);

        public Task<bool> IsExist(int teacherId, int classId, int subjectId);
    }
}
