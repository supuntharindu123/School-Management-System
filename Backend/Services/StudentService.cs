using AutoMapper;
using Backend.DTOs;
using Backend.Models;
using Backend.Repositories.Interfaces;
using Backend.Services.Interfaces;

namespace Backend.Services
{
    public class StudentService : IStudentService
    {
        private readonly IStudentRepo _repo;
        private readonly IUserRepo _userRepo;
        private readonly IUserService _userService;
        private readonly IMapper _mapper;

        public StudentService(IStudentRepo repo, IUserService userService, IMapper mapper, IUserRepo userRepo)
        {
            _repo = repo;
            _userRepo = userRepo;
            _userService = userService;
            _mapper = mapper;
        }


        public async Task CreateStudent(StudentCreateDto dto)
        {
            var regdto=_mapper.Map<RegisterDto>(dto);

            var user =await _userService.AddUserToRepo(regdto);

            var student = _mapper.Map<Student>(dto);

            student.UserId = user.Id;
            student.user = user;
            await _repo.AddStudent(student);
        }

        public async Task<List<StudentRes>> AllStudents()
        {
            var students=await _repo.GetAllStudents();

            if (!students.Any())
            {
                throw new Exception("No students found.");
            }

            var result=_mapper.Map<List<StudentRes>>(students);

            return result;

        }

        public async Task<StudentRes> StudentById(int id)
        {
            var result = await _repo.GetStudentById(id);

            if (result == null)
            {
                throw new Exception("Student Not Found");
            }

            var student= _mapper.Map<StudentRes>(result);

            return student;
        }

        public async Task DeleteStudent(int id)
        {
            var student = await _repo.GetStudentById(id);

            if(student == null)
            {
                throw new Exception("Student Not Found");
            }

            await _repo.DeleteStudent(student);
            await _userService.DeleteUser(student.UserId);
        }

        public async Task UpdateStudent(int id,StudentUpdateDto dto)
        {
            var student = await _repo.GetStudentById(id);

            if (student == null)
            {
                throw new Exception("Student Not Found");
            }

            _mapper.Map(dto, student);

            await _repo.UpdateStudent(student);
        }
    }
}
