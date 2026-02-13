using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;

namespace Backend.Repositories.Interfaces
{
    public interface IMarksRepo
    {
        public Task AddMarks(Marks marks);

        public Task<List<Marks>> GetMarksByGrade(int examId,int gradeId);

        public Task<List<Marks>> GetMarksByClass(int classId);

        public Task<List<Marks>> GetMarksForStudent(int studentId);

        public Task<List<Marks>> GetMarksByClassAndSubject(int classId,int subjectId);

        public Task<IDbContextTransaction> BeginTransactionAsync();

        public Task<Marks?> GetMarksByExamClassSubjectStudent(int examId, int classId, int subjectId, int studentId);

        public Task UpdateMarks();


    }
}
