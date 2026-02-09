using Backend.DTOs.Exam;
using Backend.Models;
using Microsoft.EntityFrameworkCore.Storage;

namespace Backend.Repositories.Interfaces
{
    public interface IExamRepo
    {
        public Task CreateExam(Exam exam);

        public Task DeleteExam(Exam exam);

        public Task UpdateExam(Exam exam);

        public Task<Exam?> GetExamById(int id);

        public Task<List<Exam>> GetExams();

        public Task<IDbContextTransaction> BeginTransactionAsync();

        public Task AssignGradesForExam(ExamGrade examGrade);

        public Task AssignSubjectsForExam(ExamGradeSubject examGradeSubject);

        public Task<ExamDetailsResDto?> ExamDetails(int id);

        public Task<bool> CheckAssignGradesForExam(int examId, int gradeId, int subjectId);


    }
}
