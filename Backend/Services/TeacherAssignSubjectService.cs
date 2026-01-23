using AutoMapper;
using Backend.DTOs;
using Backend.Helper;
using Backend.Models;
using Backend.Repositories.Interfaces;
using Backend.Services.Interfaces;

namespace Backend.Services
{
    public class TeacherAssignSubjectService : ITeacherAssignSubjectService
    {
        private readonly ITeacherAssignSubjectRepo _repo;
        private readonly IMapper _mapper;

        public TeacherAssignSubjectService(ITeacherAssignSubjectRepo repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }
        public async Task<Result> AssignSubject(AssignTeacherSubjectDto teacherSubjectClass)
        {
            var res = await _repo.IsExist(teacherSubjectClass.TeacherId, teacherSubjectClass.ClassId, teacherSubjectClass.SubjectId);

            if (res)
            {
                return Result.Failure("Already Assign to the this class for this subject");
            }

            var map=_mapper.Map<TeacherSubjectClass>(teacherSubjectClass);

            map.StartDate = DateTime.Now;
            map.IsActive = true;

            await _repo.AssignSubject(map);

            return Result.Success();

        }

        public async Task<Result<List<AssignTeacherSubjectResDto>>> GetAll()
        {
            var res=await _repo.GetAll();

            if (res == null)
            {
                return Result<List<AssignTeacherSubjectResDto>>.Failure("Teachers are not assigned any subjects");
            }

            var map = _mapper.Map<List<AssignTeacherSubjectResDto>>(res);

            return Result<List<AssignTeacherSubjectResDto>>.Success(map);
        }

        public async Task<Result<AssignTeacherSubjectResDto>> GetById(int id)
        {
            var res = await _repo.GetById(id);

            if (res == null)
            {
                return Result<AssignTeacherSubjectResDto>.Failure("Teachers are not assigned any subjects");
            }


            var map = _mapper.Map<AssignTeacherSubjectResDto>(res);

            return Result<AssignTeacherSubjectResDto>.Success(map);
        }

        public async Task<Result<List<AssignTeacherSubjectResDto>>> GetByTeacher(int id)
        {
            var res = await _repo.GetByTeacher(id);

            if (res == null)
            {
                return Result<List<AssignTeacherSubjectResDto>>.Failure("Teachers are not assigned any subjects");
            }


            var map = _mapper.Map<List<AssignTeacherSubjectResDto>>(res);

            return Result<List<AssignTeacherSubjectResDto>>.Success(map);
        }

        public async Task<Result> RemovePermission(int id)
        {
            var res = await _repo.GetById(id);
            if (res == null)
            {
                return Result.Failure("Not found assigned any subjects");
            }

            await _repo.RemovePermission(res);

            return Result.Success();
        }

        public async Task<Result> Update(int id,AssignTeacherSubjectDto teacherSubjectClass)
        {
            var exist = await _repo.IsExist(teacherSubjectClass.TeacherId, teacherSubjectClass.ClassId, teacherSubjectClass.SubjectId);

            if (exist)
            {
                return Result.Failure("Already Assign to the this class for this subject");
            }

            var res = await _repo.GetById(id);

            if (res == null)
            {
                return Result.Failure("Not found assigned any subjects");
            }

            res.EndDate = DateTime.Now;
            res.IsActive = false;

            var map = _mapper.Map<TeacherSubjectClass>(teacherSubjectClass);

            map.StartDate = DateTime.Now;
            map.IsActive = true;

            await _repo.AssignSubject(map);

            await _repo.Update(res);

            return Result.Success();
        }
    }
}
