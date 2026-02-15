using Backend.DTOs;
using Backend.Helper;
using Backend.Models;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentAttendantController : ControllerBase
    {
        private readonly IStudentAttendantService _service;
        private readonly IStudentService _studentService;
        private readonly IAuthorizationService _authorizationService;

        public StudentAttendantController(IStudentAttendantService service,IStudentService studentService, IAuthorizationService authorizationService)
        {
            _service = service;
            _studentService = studentService;
            _authorizationService = authorizationService;
        }

        [Authorize(Roles = "Teacher")]
        [HttpPost]
        public async Task<IActionResult> Attendances(List<StudentAttendances> studentAttendances)
        {
            var authRes = await _authorizationService.AuthorizeAsync(User, studentAttendances[1].ClassId, "AssignClassesOnly");

            if (!authRes.Succeeded)
            {
                return Forbid();
            }

            var res=await _service.Attendances(studentAttendances);

            if (!res.IsSuccess)
            {
                return BadRequest(res.Error);
            }

            return Ok("Attendant mark Successfully!");
        }

        [Authorize(Roles = "Admin,Teacher,Student")]
        [HttpGet("student/{studentId}")]
        public async Task<IActionResult> AttendanceByStudent(int studentId)
        {
            var student=await _studentService.StudentById(studentId);

            if (User.IsInRole("Teacher"))
            {
                var authRes = await _authorizationService.AuthorizeAsync(User, student.Data!.ClassId , "AssignClassesOnly");

                if (!authRes.Succeeded)
                {
                    return Forbid();

                }
            }

            var res = await _service.AttendanceByStudent(studentId);

            if (!res.IsSuccess)
            {
                return NotFound(res.Error);
            }

            return Ok(res.Data);
        }

        [Authorize(Roles = "Teacher")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Remove(int id)
        {

            var res = await _service.Remove(id);

            if (!res.IsSuccess)
            {
                return NotFound(res.Error);
            }

            return NoContent();
        }

        [Authorize(Roles = "Admin,Teacher")]
        [HttpGet("class/{classId}")]
        public async Task<IActionResult> ClassAttendant(int classId, [FromQuery] DateOnly date)
        {
            var authRes = await _authorizationService.AuthorizeAsync(User, classId, "AssignClassesOnly");

            if (!authRes.Succeeded)
            {
                return Forbid();
            }

            var res = await _service.ClassAttendant(classId,date);

            if (!res.IsSuccess)
            {
                return NotFound(res.Error);
            }

            return Ok(res.Data);
        }

        [Authorize(Roles = "Admin,Teacher")]
        [HttpGet("{id}")]
        public async Task<IActionResult> AttendantById(int id)
        {
            var res = await _service.AttendantById(id);

            if (!res.IsSuccess)
            {
                return NotFound(res.Error);
            }

            return Ok(res.Data);
        }

        [Authorize(Roles = "Admin,Teacher")]
        [HttpGet("date")]
        public async Task<IActionResult> AttendantByDate([FromQuery] DateOnly date)
        {
            var res = await _service.AttendantByDate(date);

            if (!res.IsSuccess)
            {
                return NotFound(res.Error);
            }

            return Ok(res.Data);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> Attendants()
        {
            var res = await _service.AllAttendances();

            if (!res.IsSuccess)
            {
                return NotFound(res.Error);
            }

            return Ok(res.Data);
        }

        [Authorize(Roles = "Teacher")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAttendant(int id,StudentAttendances studentAttendances)
        {
            var authRes = await _authorizationService.AuthorizeAsync(User, studentAttendances.ClassId, "AssignClassesOnly");

            if (!authRes.Succeeded)
            {
                return Forbid();
            }

            var res = await _service.UpdateAttendant(id,studentAttendances);

            if (!res.IsSuccess)
            {
                return BadRequest(res.Error);
            }

            return NoContent();
        }
    }
}
