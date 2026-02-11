using AutoMapper;
using Backend.DTOs.Marks;
using Backend.Helper;
using Backend.Models;
using Backend.Repositories;
using Backend.Repositories.Interfaces;
using Backend.Services.Interfaces;

namespace Backend.Services
{
    public class MarksService : IMarksService
    {
        private readonly IMarksRepo _repo;
        private readonly IMapper _mapper;
        

        public MarksService(IMarksRepo repo,IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
            
        }

        public async Task<Result> AddMarks(Marks marks)
        {
            await _repo.AddMarks(marks);
            return Result.Success();
        }

        public Task<Result<List<MarkResDto>>> GetMarksByClass(int examId, int classId)
        {
            throw new NotImplementedException();
        }

        public async Task<Result<List<MarkResDto>>> GetMarksByGrade(int examId, int gradeId)
        {
            var res=await _repo.GetMarksByGrade(examId, gradeId);

            if (res == null)
            {
                return Result<List<MarkResDto>>.Failure("Marks Not Found");
            }

            var map=_mapper.Map<List<MarkResDto>>(res);

            return Result<List<MarkResDto>>.Success(map);
        }

        public Task<Result<List<MarkResDto>>> GetMarksForStudent(int studentId)
        {
            throw new NotImplementedException();
        }
    }
}
