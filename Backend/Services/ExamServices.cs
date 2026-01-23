using AutoMapper;
using Backend.DTOs;
using Backend.Helper;
using Backend.Models;
using Backend.Repositories.Interfaces;
using Backend.Services.Interfaces;

namespace Backend.Services
{
    public class ExamServices:IExamServices
    {
        private readonly IExamRepo _repo;
        private readonly IMapper _mapper;

        public ExamServices(IExamRepo repo, IMapper mapper)
        {
            _repo=repo;
            _mapper=mapper;
        }

        public async Task<Result> CreateExam(Exam exam)
        {
            await _repo.CreateExam(exam);
            return Result.Success();
        }

        public async Task<Result> DeleteExam(int id)
        {
            var res =await _repo.GetExamById(id);

            if(res == null)
            {
                return Result.Failure("Exam Not found");
            }

            return Result.Success();
        }

        public async Task<Result<ExamResDto?>> GetExamById(int id)
        {
            var res = await _repo.GetExamById(id);

            if (res == null)
            {
                return Result<ExamResDto?>.Failure("Exam Not found");
            }
            
            var map=_mapper.Map<ExamResDto>(res);

            return Result<ExamResDto?>.Success(map);
        }

        public async Task<Result<List<ExamResDto>>> GetExams()
        {
            var res = await _repo.GetExams();

            if (res == null)
            {
                return Result<List<ExamResDto>>.Failure("Exam Not found");
            }

            var map = _mapper.Map<List<ExamResDto>>(res);

            return Result<List<ExamResDto>>.Success(map);
        }

        public async Task<Result> UpdateExam(int id,ExamUpdateDto exam)
        {
            var res = await _repo.GetExamById(id);

            if (res == null)
            {
                return Result.Failure("Exam Not found");
            }

            _mapper.Map(exam, res);

            await _repo.UpdateExam(res);

            return Result.Success();
        }
    }
}
