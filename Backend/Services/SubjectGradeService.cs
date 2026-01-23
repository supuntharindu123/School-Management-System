using Backend.Helper;
using Backend.Models;
using Backend.Repositories.Interfaces;
using Backend.Services.Interfaces;

namespace Backend.Services
{
    public class SubjectGradeService : ISubjectGradeService
    {
        private readonly ISubjectGradeRepo _repo;

        public SubjectGradeService(ISubjectGradeRepo repo)
        {
            _repo = repo;
        }

        public async Task<Result> Add(SubjectGrade subjectGrade)
        {
            await _repo.Add(subjectGrade);
            return Result.Success();
        }

        public async Task<Result<List<SubjectGrade>>> GetByGrade(int id)
        {
            var subjects=await _repo.GetByGrade(id);

            if(subjects == null)
            {
                return Result<List<SubjectGrade>>.Failure("Subject assigned to grades not found");
            }

            return Result<List<SubjectGrade>>.Success(subjects);
        }

        public async Task<Result<SubjectGrade>> GetById(int id)
        {
            var res = await _repo.GetById(id);

            if (res == null)
            {
                return Result<SubjectGrade>.Failure("Subject assigned to grade not found");
            }

            return Result<SubjectGrade>.Success(res);
        }

        public async Task<Result> Remove(int id)
        {
            var res = await _repo.GetById(id);

            if (res == null)
            {
                return Result.Failure("Subject assigned to grade not found");
            }

            await _repo.Remove(res);

            return Result.Success();
        }
    }
}
