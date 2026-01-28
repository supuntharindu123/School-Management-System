using Backend.Models;

namespace Backend.Repositories.Interfaces
{
    public interface ISubjectGradeRepo
    {
        public Task Add(int subjectId,List<SubjectGrade> subjectGrade);

        public Task Remove(SubjectGrade subjectGrade);

        public Task<SubjectGrade?> GetById(int id);

        public Task<List<SubjectGrade>> GetByGrade(int gradeId);
    }
}
