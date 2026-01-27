using AutoMapper;
using Backend.DTOs;
using Backend.Helper;
using Backend.Models;
using Backend.Repositories.Interfaces;
using Backend.Services.Interfaces;

namespace Backend.Services
{
    public class SubjectService:ISubjectService
    {
        private readonly ISubjectRepo _repo;
        private readonly IMapper _mapper;

        public SubjectService(ISubjectRepo repo, IMapper mapper)
        {
            _repo = repo; 
            _mapper = mapper;
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

        public async Task<Result<SubjectGradeResDto>> GetSubjectByID(int id)
        {
            var subject=await _repo.GetSubjectById(id);

            if(subject == null)
            {
                return Result<SubjectGradeResDto>.Failure("Subject Not Found");
            }

            var map=_mapper.Map<SubjectGradeResDto>(subject);

            return Result<SubjectGradeResDto>.Success(map);
        }

        public async Task<Result<List<SubjectGradeResDto>>> GetSubjects()
        {
            var subjects = await _repo.GetSubjects();

            if (subjects == null)
            {
                return Result<List<SubjectGradeResDto>>.Failure("Subjects Not Found");
            }

            var map = _mapper.Map<List<SubjectGradeResDto>>(subjects);

            return Result<List<SubjectGradeResDto>>.Success(map);
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
