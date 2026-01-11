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
        public TeacherService(ITeacherRepo repo, IMapper mapper, IUserService userService) { 
            _repo = repo;
            _mapper = mapper;
            _userService = userService;
        }

        public async Task CreateTeacher(TeacherCreateDto dto)
        {
            var regdto=_mapper.Map<RegisterDto>(dto);
            var users=await _userService.AddUserToRepo(regdto);


            var teacherdto = _mapper.Map<Teacher>(dto);
            teacherdto.UserId = users.Id;
            await _repo.AddTeacher(teacherdto);
        }
    }
}
