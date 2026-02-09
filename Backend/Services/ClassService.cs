using AutoMapper;
using Backend.DTOs.Grade;
using Backend.Helper;
using Backend.Models;
using Backend.Repositories.Interfaces;
using Backend.Services.Interfaces;

namespace Backend.Services
{
    public class ClassService : IClassService
    {
        private readonly IClassRepo _repo;
        private readonly IMapper _mapper;

        public ClassService(IClassRepo repo, IMapper mapper)
        {
            _repo = repo; 
            _mapper = mapper;
        }
        public async Task<Result> CreateClass(Class clz)
        {
            var cl = await _repo.GetClassByIDs(clz.GradeId, clz.ClassNameID);

            if (cl!=null)
            {
                return Result.Failure("Class Already Exists");
            }

            await _repo.CreateClass(clz);

            return Result.Success();

        }

        public async Task<Result<List<Class>>> GetClassByGrade(int gradeId)
        {
            var classes = await _repo.GetClassByGrade(gradeId);

            return Result<List<Class>>.Success(classes);
        }


        public async Task<Result<ClassDetailsResDto>> GetClassById(int id)
        {
            var clz = await _repo.GetClassById(id);
            if (clz == null)
            {
                return Result<ClassDetailsResDto>.Failure("Class Not Found");
            }

            var map=_mapper.Map<ClassDetailsResDto>(clz);

            return Result<ClassDetailsResDto>.Success(map);
        }

        public async Task<Result> RemoveClass(int id)
        {
            var res = await _repo.GetClass(id);

            if (res == null)
            {
               return Result.Failure("Class Not Found");
            }

            await _repo.DeleteClass(res);

            return Result.Success();
        }

        public async Task<Result<List<ClassDetailsResDto>>> GetClasses()
        {
            var res=await _repo.GetClasses();

            if (res == null)
            {
                return Result<List<ClassDetailsResDto>>.Failure("Classes Not Found");
            }

            var map = _mapper.Map<List<ClassDetailsResDto>>(res);

            return Result<List<ClassDetailsResDto>>.Success(map);

        }

    }
}
