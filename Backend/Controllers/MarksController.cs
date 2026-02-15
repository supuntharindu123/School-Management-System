using Backend.DTOs.AuthResources;
using Backend.DTOs.Marks;
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
    public class MarksController : ControllerBase
    {
        private readonly IMarksService _service;
        private readonly IAuthorizationService _authorizationService;
        private readonly IStudentService _studentService;

        public MarksController(IMarksService service, IAuthorizationService authorizationService, IStudentService studentService)
        {
            _service = service;
            _authorizationService = authorizationService;
            _studentService = studentService;
        }

        [Authorize(Roles = "Teacher")]
        [HttpPost]
        public async Task<IActionResult> AddMarks(List<Marks> marks)
        {

                var authRes = await _authorizationService.AuthorizeAsync(User, marks[0].ClassId, "AssignClassesOnly");

                if (!authRes.Succeeded)
                {
                    return Forbid();

                }
            
            await _service.AddMarks(marks);
            return Ok("Marks Adding Successfully!");
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("{examId}/{gradeId}")]
        public async Task<IActionResult> GetMarksByGrade(int examId,int gradeId)
        {
            var res=await _service.GetMarksByGrade(examId, gradeId);

            if (!res.IsSuccess)
            {
                return NotFound(res.Error);
            }

            return Ok(res.Data);
        }

        [Authorize(Roles = "Admin,Teacher,Student")]
        [HttpGet("{studentId}")]
        public async Task<IActionResult> GetMarksForStudent(int studentId)
        {
            var res = await _service.GetMarksForStudent(studentId);

            var student=await _studentService.StudentById(studentId);

            if (User.IsInRole("Admin"))
                return Ok(res.Data);

            if (User.IsInRole("Teacher"))
            {
                var authRes = await _authorizationService.AuthorizeAsync(User, student.Data!.ClassId, "AssignClassesOnly");

                if (!authRes.Succeeded)
                    return Forbid();

                return Ok(res.Data);
            }

            if (User.IsInRole("Student"))
            {
                var authRes = await _authorizationService.AuthorizeAsync(User, studentId, "StudentOwnDataPolicy");

                if (!authRes.Succeeded)
                    return Forbid();

                return Ok(res.Data);
            }

            if (!res.IsSuccess)
            {
                return NotFound(res.Error);
            }

            return Ok(res.Data);
        }

        [Authorize(Roles = "Admin,Teacher")]
        [HttpGet("class/{classId}")]
        public async Task<IActionResult> GetMarksByClass(int classId)
        {
            var res = await _service.GetMarksByClass(classId);

            if (User.IsInRole("Teacher"))
            {
                var authRes = await _authorizationService.AuthorizeAsync(User, classId, "AssignClassesOnly");

                if (!authRes.Succeeded)
                    return Forbid();

                return Ok(res.Data);
            }

            if (!res.IsSuccess)
            {
                return NotFound(res.Error);
            }

            return Ok(res.Data);
        }

        [Authorize(Roles = "Admin,Teacher")]
        [HttpGet("class/{classId}/subject/{subjectId}")]
        public async Task<IActionResult> GetMarksByClassandSubject(int classId, int subjectId)
        {
            var res = await _service.GetMarksByClass(classId);

            var req = new AssignSubjectResourceDto();

            req.ClassId = classId;
            req.SubjectId = subjectId;

            if (User.IsInRole("Teacher"))
            {
                var authRes = await _authorizationService.AuthorizeAsync(User, req, "AssignSubjectsOnly");

                if (!authRes.Succeeded)
                    return Forbid();

                return Ok(res.Data);
            }

            if (!res.IsSuccess)
            {
                return NotFound(res.Error);
            }

            return Ok(res.Data);
        }
    }
}
