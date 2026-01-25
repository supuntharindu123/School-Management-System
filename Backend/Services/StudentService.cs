using AutoMapper;
using Backend.DTOs;
using Backend.Helper;
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
        private readonly IClassRepo _classRepo;
        private readonly IMapper _mapper;

        public StudentService(IStudentRepo repo, IUserService userService, IMapper mapper, IUserRepo userRepo, IStudentHistoryRepo historyrepo, IClassRepo classRepo)
        {
            _repo = repo;
            _userRepo = userRepo;
            _userService = userService;
            _mapper = mapper;
            _historyrepo = historyrepo;
            _classRepo = classRepo;
        }


        public async Task<Result> CreateStudent(StudentCreateDto dto)
        {
            // 1️⃣ Create user
            var regdto = _mapper.Map<RegisterDto>(dto);
            var userResult = await _userService.AddUserToRepo(regdto);

            if (!userResult.IsSuccess || userResult.Data == null)
            {
                return Result.Failure(userResult.Error ?? "User creation failed");
            }

            // 2️⃣ Get class
            var clz = await _classRepo.GetClassByIDs(dto.GradeId, dto.ClassNameId);
            if (clz == null)
            {
                return Result.Failure("Class not found for the selected grade");
            }

            // 3️⃣ Create student
            var student = _mapper.Map<Student>(dto);
            student.UserId = userResult.Data.Id;
            student.ClassId = clz.Id;

            await _repo.AddStudent(student);

            // 4️⃣ Create academic history
            var studentHistory = _mapper.Map<StudentAcademicHistory>(dto);
            studentHistory.StudentId = student.Id;
            studentHistory.ClassId = clz.Id;

            await _historyrepo.AddStudentHistory(studentHistory);

            return Result.Success();
        }


        public async Task<Result<IEnumerable<StudentRes>>> AllStudents()
        {
            var students=await _repo.GetAllStudents();

            if (!students.Any())
            {
                return Result<IEnumerable<StudentRes>>.Failure("Students Not Found");
            }

            var result=_mapper.Map<List<StudentRes>>(students);

            return Result<IEnumerable<StudentRes>>.Success(result);

        }

        public async Task<Result<StudentRes>> StudentById(int id)
        {
            var result = await _repo.GetStudentById(id);

            if (result == null)
            {
                return Result<StudentRes>.Failure("Student Not Found");
            }

            var student= _mapper.Map<StudentRes>(result);

            return Result<StudentRes>.Success(student);
        }

        public async Task<Result> DeleteStudent(int id)
        {
            var student = await _repo.GetStudentById(id);

            if(student == null)
            {
                throw new Exception("Student Not Found");
            }
            await _userRepo.DeleteUser(student.User);

            return Result.Success();
        }

        public async Task<Result> UpdateStudent(int id,StudentUpdateDto dto)
        {
            var student = await _repo.GetStudentById(id);

            if (student == null)
            {
                return Result.Failure("Student Not Found");
            }

            _mapper.Map(dto, student);

            await _repo.UpdateStudent(student);

            return Result.Success();
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

            int row = 2;

            foreach (var s in studentRes)
            {
                sheet.Cells[row, 1].Value = s.StudentIDNumber;
                sheet.Cells[row, 2].Value = s.FullName;
                sheet.Cells[row, 3].Value = s.Email;
                sheet.Cells[row, 4].Value = s.PhoneNumber;
                sheet.Cells[row, 5].Value = s.Gender;
                sheet.Cells[row, 6].Value = s.BirthDay.ToString("yyyy-MM-dd");
                sheet.Cells[row, 7].Value = s.CurrentClass;
                sheet.Cells[row, 8].Value = s.Address;

                row++;
            }

            sheet.Cells.AutoFitColumns();

            return package.GetAsByteArray();
        }
    }
}
