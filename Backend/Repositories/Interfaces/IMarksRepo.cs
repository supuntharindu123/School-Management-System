using Backend.Models;

namespace Backend.Repositories.Interfaces
{
    public interface IMarksRepo
    {
        public Task AddMarks(Marks marks);

        public Task<List<Marks>> GetMarksByGrade(int examId,int gradeId);

        public Task<List<Marks>> GetMarksByClass(int examId,int classId);

        public Task<List<Marks>> GetMarksForStudent(int studentId);
    }
}
