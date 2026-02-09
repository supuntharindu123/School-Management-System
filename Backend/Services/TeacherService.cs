using AutoMapper;
using Backend.DTOs.Teacher;
using Backend.DTOs.User;
using Backend.Helper;
using Backend.Models;
using Backend.Repositories.Interfaces;
using Backend.Services.Interfaces;

namespace Backend.Services
{
    public class TeacherService:ITeacherService
    {
        private readonly ITeacherRepo _repo;
        private readonly IMapper _mapper;
        private readonly IUserService _userService;
        private readonly IUserRepo _userRepo;
        public TeacherService(ITeacherRepo repo, IMapper mapper, IUserService userService, IUserRepo userrepo) { 
            _repo = repo;
            _mapper = mapper;
            _userService = userService;
            _userRepo = userrepo;
        }

        public async Task<Result> CreateTeacher(TeacherCreateDto dto)
        {
            var regdto=_mapper.Map<RegisterDto>(dto);
            var users=await _userService.AddUserToRepo(regdto);


            var teacherdto = _mapper.Map<Teacher>(dto);
            teacherdto.UserId = users.Data.Id;
            teacherdto.User = users.Data;
            await _repo.AddTeacher(teacherdto);

            return Result.Success();
        }

        public async Task<Result> DeleteTeacher(int id)
        {
            
            var teacher=await _repo.GetTeacherById(id);

            if (teacher == null)
            {
                return Result.Failure("Teacher Not Found");
            }
          
            await _userRepo.DeleteUser(teacher.User);

            return Result.Success();
        }

        public async Task<Result<IEnumerable<TeacherResponseDto>>> GetAllTeachers()
        {
            var results=await _repo.GetTeachers();
            if(results == null)
            {
                return Result<IEnumerable<TeacherResponseDto>>.Failure("Teachers Not Found");
            }
            var teachers = _mapper.Map<List<TeacherResponseDto>>(results);

            return Result<IEnumerable<TeacherResponseDto>>.Success(teachers);
        }

        public async Task<Result<TeacherResponseDto>> GetTeacher(int id)
        {
            var result = await _repo.GetTeacherById(id);
            if (result == null)
            {
                return Result<TeacherResponseDto>.Failure("Teacher Not Found");
             }
            var teacher=_mapper.Map<TeacherResponseDto>(result);

            return Result<TeacherResponseDto>.Success(teacher);
        }

        public async Task<Result> UpdateTeacher(int id, TeacherUpdateDto dto)
        {
            var teacher=await _repo.GetTeacherById(id);

            if(teacher == null)
            {
                return Result.Failure("Teacher Not Found");
            }

            _mapper.Map(dto, teacher);

            await _repo.UpdateTeacher(teacher);

            return Result.Success();
        }
    }
}
