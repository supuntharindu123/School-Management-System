using AutoMapper;
using Backend.DTOs;
using Backend.Models;
using Backend.Repositories.Interfaces;
using Backend.Services.Interfaces;
using OfficeOpenXml;

namespace Backend.Services
{
    public class StudentService : IStudentService
    {
        private readonly IStudentRepo _repo;
        private readonly IUserRepo _userRepo;
        private readonly IStudentHistoryRepo _historyrepo;
        private readonly IUserService _userService;
        private readonly IMapper _mapper;

        public StudentService(IStudentRepo repo, IUserService userService, IMapper mapper, IUserRepo userRepo, IStudentHistoryRepo historyrepo)
        {
            _repo = repo;
            _userRepo = userRepo;
            _userService = userService;
            _mapper = mapper;
            _historyrepo = historyrepo;
        }


        public async Task CreateStudent(StudentCreateDto dto)
        {
            var regdto=_mapper.Map<RegisterDto>(dto);

            var user =await _userService.AddUserToRepo(regdto);

            var student = _mapper.Map<Student>(dto);

            var studenthistory = _mapper.Map<StudentAcademicHistory>(dto);

            student.UserId = user.Id;
            student.User = user;
            await _repo.AddStudent(student);

            studenthistory.StudentID=student.Id;
            studenthistory.student = student;

            await _historyrepo.AddStudentHistory(studenthistory);
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
            await _userRepo.DeleteUser(student.User);
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

   
        public byte[] ExportToExcel(List<StudentRes> studentRes)
        {
            
            using var package = new ExcelPackage();

            var sheet = package.Workbook.Worksheets.Add("students");

            sheet.Cells[1, 1].Value = "Student ID";
            sheet.Cells[1, 2].Value = "Full Name";
            sheet.Cells[1, 3].Value = "Email";
            sheet.Cells[1, 4].Value = "Phone";
            sheet.Cells[1, 5].Value = "Gender";
            sheet.Cells[1, 6].Value = "Birthday";
            sheet.Cells[1, 7].Value = "Grade";
            sheet.Cells[1, 8].Value = "Class";
            sheet.Cells[1, 9].Value = "Academic Year";
            sheet.Cells[1, 10].Value = "Address";

            int row = 2;

            foreach (var s in studentRes)
            {
                sheet.Cells[row, 1].Value = s.StudentIDNumber;
                sheet.Cells[row, 2].Value = s.FullName;
                sheet.Cells[row, 3].Value = s.Email;
                sheet.Cells[row, 4].Value = s.PhoneNumber;
                sheet.Cells[row, 5].Value = s.Gender;
                sheet.Cells[row, 6].Value = s.BirthDay.ToString("yyyy-MM-dd");
                sheet.Cells[row, 7].Value = s.Grade;
                sheet.Cells[row, 8].Value = s.Class;
                sheet.Cells[row, 9].Value = s.AcademicYear;
                sheet.Cells[row, 10].Value = s.Address;

                row++;
            }

            sheet.Cells.AutoFitColumns();

            return package.GetAsByteArray();
        }
    }
}
