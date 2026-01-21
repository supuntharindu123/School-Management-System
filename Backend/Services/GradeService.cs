using Backend.Helper;
using Backend.Models;
using Backend.Repositories.Interfaces;
using Backend.Services.Interfaces;

namespace Backend.Services
{
    public class GradeService : IGradeService
    {
        private readonly IGradeRepo _repo;

        public GradeService(IGradeRepo repo)
        {
            _repo = repo;
        }
        public async Task<Result<Grade>> GetGrade(int id)
        {
            var grade=await _repo.GradeById(id);

            if (grade == null)
            {
                return Result<Grade>.Failure("Grade Not Found");
            }

            return Result<Grade>.Success(grade);
        }

        public async Task<Result<IEnumerable<Grade>>> GetAllGrades()
        {
            var grade = await _repo.GetGrades();

            if (grade == null)
            {
                return Result<IEnumerable<Grade>>.Failure("Grades Not Found");
            }

            return Result<IEnumerable<Grade>>.Success(grade);
        }


    }
}
