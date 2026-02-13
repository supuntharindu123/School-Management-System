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

        public async Task<Result> AddMarks(List<Marks> marks)
        {
            using var Transaction = await _repo.BeginTransactionAsync();

            try
            {
                foreach (var m in marks)
                {
                    var res = await _repo.GetMarksByExamClassSubjectStudent(m.ExamId, m.ClassId, m.SubjectId, m.StudentId);

                    if (res != null)
                    {
                        res.ExamId = m.ExamId;
                        res.StudentId = m.StudentId;
                        res.ClassId = m.ClassId;
                        res.SubjectId = m.SubjectId;
                        res.GradeId=m.GradeId;
                        res.Score = m.Score;
                        res.IsPresent = m.IsPresent;
                        res.Reason = m.Reason;
                    }
                    else
                    {
                        await _repo.AddMarks(m);
                    }
                       
                }

                await _repo.UpdateMarks();   
                Transaction.Commit();
                return Result.Success();

            }
            catch (Exception ex)
            {
                await Transaction.RollbackAsync();
                return Result.Failure($"Failed to assign grade: {ex.Message} {ex.InnerException?.Message}");
            }
            
        }

        public async Task<Result<List<MarkResDto>>> GetMarksByClass( int classId)
        {
            var res = await _repo.GetMarksByClass(classId);

            if (res == null)
            {
                return Result<List<MarkResDto>>.Failure("Marks Not Found!");
            }

            var map = _mapper.Map<List<MarkResDto>>(res);

            return Result<List<MarkResDto>>.Success(map);
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

        public async Task<Result<List<MarkResDto>>> GetMarksForStudent(int studentId)
        {
            var res=await _repo.GetMarksForStudent(studentId);

            if(res == null)
            {
                return Result<List<MarkResDto>>.Failure("Marks Not Found!");
            }

            var map = _mapper.Map<List<MarkResDto>>(res);

            return Result<List<MarkResDto>>.Success(map);
        }

        public async Task<Result<List<MarkResDto>>> GetMarksByClassAndSubject(int classId, int subjectId)
        {
            var res = await _repo.GetMarksByClassAndSubject(classId,subjectId);

            if (res == null)
            {
                return Result<List<MarkResDto>>.Failure("Marks Not Found!");
            }

            var map = _mapper.Map<List<MarkResDto>>(res);

            return Result<List<MarkResDto>>.Success(map);
        }


    }
}
