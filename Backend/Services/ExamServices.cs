using AutoMapper;
using Backend.DTOs.Exam;
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

            await _repo.DeleteExam(res);

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

        public async Task<Result> AssignGradesForExam(int examId,List<int> gradeIds)
        {
            using var Transaction=await _repo.BeginTransactionAsync();

            try
            {
                var res = await _repo.GetGradeByExamId(examId);

                await _repo.DeleteAssignGradeForExam(res);

                foreach(var eg in gradeIds)
                {
                    var exam = new ExamGrade
                    {
                        ExamId = examId,
                        GradeId = eg
                    };
                    await _repo.AssignGradesForExam(exam);
                }

                await Transaction.CommitAsync();
                return Result.Success();

            }
            catch(Exception ex)
            {
                await Transaction.RollbackAsync();
                return Result.Failure($"Failed to assign grade: {ex.Message} {ex.InnerException?.Message}");

            }
        }

        public async Task<Result> AssignSubjectsForExam(int examId, int gradeId,List<int> subjectIds)
        {
            using var Transaction = await _repo.BeginTransactionAsync();

            try
            {
                var res = await _repo.GetSubjectAssignsGradesAndExam(examId, gradeId);

                await _repo.DeleteSubjectsAssignGradesForExam(res);

                foreach (var subjectId in subjectIds)
                {
                    if(!await _repo.CheckAssignGradesForExam(examId, gradeId, subjectId)){
                        var exam = new ExamGradeSubject();
                        exam.ExamId = examId;
                        exam.GradeId = gradeId;
                        exam.SubjectId = subjectId;
                        await _repo.AssignSubjectsForExam(exam);
                    }  
                }
                await Transaction.CommitAsync();
                return Result.Success();
            }
            catch
            {
                await Transaction.RollbackAsync();
                return Result.Failure("Failed to assign grade for exam!");
            }
        }

        public async Task<Result<ExamDetailsResDto>> ExamDetails(int id)
        {
            var res=await _repo.ExamDetails(id);

            if (res == null)
            {
                return Result<ExamDetailsResDto>.Failure("Exam Not Found!");
            }

            return Result<ExamDetailsResDto>.Success(res);
        }
    }
}
