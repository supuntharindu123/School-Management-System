using AutoMapper;
using Backend.DTOs;
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

        public async Task CreateTeacher(TeacherCreateDto dto)
        {
            var regdto=_mapper.Map<RegisterDto>(dto);
            var users=await _userService.AddUserToRepo(regdto);


            var teacherdto = _mapper.Map<Teacher>(dto);
            teacherdto.UserId = users.Id;
            teacherdto.user = users;
            await _repo.AddTeacher(teacherdto);
        }

        public async Task DeleteTeacher(int id)
        {
            
            var teacher=await _repo.GetTeacherById(id);

            if (teacher == null)
            {
                throw new Exception("Teacher Not Found");
            }
          
            await _userRepo.DeleteUser(teacher.user);
        }

        public async Task<List<TeacherRes>> GetAllTeachers()
        {
            var results=await _repo.GetTeachers();
            if(results == null)
            {
                throw new Exception("Teachers Not Found");
            }
            var teachers = _mapper.Map<List<TeacherRes>>(results);
            return teachers;
        }

        public async Task<TeacherRes> GetTeacher(int id)
        {
            var result = await _repo.GetTeacherById(id);
            if (result == null)
            {
                throw new Exception("Teacher Not Found");
             }
            var teacher=_mapper.Map<TeacherRes>(result);

            return teacher;
        }

        public async Task UpdateTeacher(int id, TeacherUpdateDto dto)
        {
            var teacher=await _repo.GetTeacherById(id);
            if(teacher == null)
            {
                throw new Exception("Teacher Not Found");
            }

            _mapper.Map(dto, teacher);

            await _repo.UpdateTeacher(teacher);
        }
    }
}
