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
        public async Task<Grade> GetGrade(int id)
        {
            var grade=await _repo.GradeById(id);

            if (grade == null)
            {
                throw new Exception("Grade Not Found");
            }

            return grade;
        }

        public async Task<List<Grade>> GetAllGrades()
        {
            var grade = await _repo.GetGrades();

            if (grade == null)
            {
                throw new Exception("Grade Not Found");
            }

            return grade;
        }


    }
}
