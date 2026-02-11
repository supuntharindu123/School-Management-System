using Backend.DTOs.Exam;
using Backend.Helper;
using Backend.Models;

namespace Backend.Services.Interfaces
{
    public interface IExamServices
    {
        public Task<Result> CreateExam(Exam exam);

        public Task<Result> DeleteExam(int id);

        public Task<Result> UpdateExam(int id,ExamUpdateDto exam);

        public Task<Result<ExamResDto?>> GetExamById(int id);

        public Task<Result<List<ExamResDto>>> GetExams();

        public Task<Result> AssignGradesForExam(int examId, List<int> gradeId);

        public Task<Result> AssignSubjectsForExam(int examId, int gradeId, List<int> subjectIds);

        public Task<Result<ExamDetailsResDto>> ExamDetails(int id);
    }
}
