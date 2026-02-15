using Backend.DTOs.Student;
using Backend.Models;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentController : ControllerBase
    {
        private readonly IStudentService _service;
        private readonly IAuthorizationService _authorizationService;
        public StudentController(IStudentService service,IAuthorizationService authorizationService) { 
            _service = service;
            _authorizationService = authorizationService;
        
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("add")]
        public async Task<IActionResult> CreateStudent(StudentCreateDto dto)
        {
            var res=await _service.CreateStudent(dto);
            if(!res.IsSuccess)
            {
                return BadRequest(res.Error);
            }
            return Ok("Student Registration Successfully !");
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetStudentAll()
        {
            var results=await _service.AllStudents();
            if (!results.IsSuccess)
            {
                return NotFound(results.Error);
            }
            return Ok(results.Data);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStudent(int id) { 
            var res=await _service.DeleteStudent(id);
            if(!res.IsSuccess)
            {
                return NotFound(res.Error);
            }
            return Ok("Student Delete Successfully !");
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStudent(int id, StudentUpdateDto dto)
        {
            var res = await _service.UpdateStudent(id, dto);
            if(!res.IsSuccess)
            {
                return BadRequest(res.Error);
            }
            return Ok("Student Update Successfully !");
        }


        [Authorize(Roles = "Admin,Teacher,Student")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetStudent(int id)
        {
            var studentRes = await _service.StudentById(id);

            if (!studentRes.IsSuccess)
                return NotFound(studentRes.Error);

            var student = studentRes.Data!;
            var classId = student.ClassId;

            if (User.IsInRole("Admin"))
                return Ok(student);

            if (User.IsInRole("Teacher"))
            {
                var authRes = await _authorizationService.AuthorizeAsync(User,classId, "AssignClassesOnly");

                if (!authRes.Succeeded)
                    return Forbid();

                return Ok(student);
            }

            if (User.IsInRole("Student"))
            {
                var authRes = await _authorizationService.AuthorizeAsync(User,id, "StudentOwnDataPolicy");

                if (!authRes.Succeeded)
                    return Forbid();

                return Ok(student);
            }

            return Forbid();
        }


        [Authorize(Roles = "Admin")]
        [HttpGet("exportStudents")]
        public async Task<IActionResult> ExportToExcelStudents()
        {
            var res = await _service.AllStudents();

            if (!res.IsSuccess)
            {
                return BadRequest(res.Error);
            }

            var students = res.Data.ToList();

            var filebytes = _service.ExportToExcel(students);

            return File(
                filebytes,
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "Students.xlsx"
                );
        }

        [Authorize(Roles = "Admin,Teacher")]
        [HttpGet("class/{classId}")]
        public async Task<IActionResult> GetStudentsByClass(int classId)
        {

            if (User.IsInRole("Admin"))
            {
                var adminRes = await _service.GetStudentsByClass(classId);

                if (!adminRes.IsSuccess)
                    return NotFound(adminRes.Error);

                return Ok(adminRes.Data);
            }

            var authResult = await _authorizationService.AuthorizeAsync(User, classId, "AssignClassesOnly");

            if (!authResult.Succeeded)
            {
                return Forbid();
            }

            var res=await _service.GetStudentsByClass(classId);

            if (!res.IsSuccess)
            {
                return NotFound(res.Error);
            }

            return Ok(res.Data);
        }
    }
}
