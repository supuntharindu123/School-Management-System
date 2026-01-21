using Backend.Helper;
using Backend.Models;
using Backend.Repositories.Interfaces;
using Backend.Services.Interfaces;

namespace Backend.Services
{
    public class SubjectService:ISubjectService
    {
        private readonly ISubjectRepo _repo;

        public SubjectService(ISubjectRepo repo)
        {
            _repo = repo; 
        }

        public async Task<Result> AddSubject(Subject subject)
        {
            var sub =await _repo.SubjectExists(subject);

            if (sub != null)
            {
                return Result.Failure("Subject Already Exists");
            }

            await _repo.AddSubject(subject);
            return Result.Success();
        }

        public async Task<Result<Subject>> GetSubjectByID(int id)
        {
            var subject=await _repo.GetSubjectById(id);

            if(subject == null)
            {
                return Result<Subject>.Failure("Subject Not Found");
            }

            return Result<Subject>.Success(subject);
        }

        public async Task<Result<IEnumerable<Subject>>> GetSubjects()
        {
            var subjects = await _repo.GetSubjects();

            if (subjects == null)
            {
                return Result<IEnumerable<Subject>>.Failure("Subjects Not Found");
            }

            return Result<IEnumerable<Subject>>.Success(subjects);
        }

        public async Task<Result> RemoveSubject(int id)
        {
            var subject= await _repo.GetSubjectById(id);

            if (subject == null)
            {
                return Result.Failure("Subjects Not Found");
            }

            await _repo.DeleteSubject(subject);
            return Result.Success();

        }

        public async Task<Result> UpdateSubject(int id,Subject subject)
        {
            var sub =await _repo.SubjectExists(subject);

            if (sub != null)
            {
                return Result.Failure("Subject Already Exists");
            }

            var subjects=await _repo.GetSubjectById(id);

            if (subjects == null)
            {
                return Result.Failure("Subjects Not Found");
            }

            subjects.ModuleCode = subject.ModuleCode;
            subjects.SubjectName = subject.SubjectName;

            await _repo.UpdateSubject(subjects);

            return Result.Success();
        }
    }
}
