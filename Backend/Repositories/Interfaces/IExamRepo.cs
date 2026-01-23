using Backend.Models;

namespace Backend.Repositories.Interfaces
{
    public interface IExamRepo
    {
        public Task CreateExam(Exam exam);

        public Task DeleteExam(Exam exam);

        public Task UpdateExam(Exam exam);

        public Task<Exam?> GetExamById(int id);

        public Task<List<Exam>> GetExams();
    }
}
