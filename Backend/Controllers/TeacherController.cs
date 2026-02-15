using Backend.DTOs.AuthResources;
using Backend.DTOs.Teacher;
using Backend.Helper;
using Backend.Models;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TeacherController : ControllerBase
    {
        private readonly ITeacherService _service;
        private readonly ITeacherAssignmentService _assignmentService;
        private readonly ITeacherAssignSubjectService _assignSubjectService;
        private readonly IAuthorizationService _authorizationService;
        public TeacherController(ITeacherService service, ITeacherAssignmentService assignmentService, ITeacherAssignSubjectService assignSubjectService, IAuthorizationService authorizationService)
        {
            _service = service;
            _assignmentService = assignmentService;
            _assignSubjectService = assignSubjectService;
            _authorizationService = authorizationService;
        }

        [Authorize(Roles ="Admin")]
        [HttpPost("add")]
        public async Task<IActionResult> CreateTeacher(TeacherCreateDto dto)
        {
            var res= await _service.CreateTeacher(dto);

            if(!res.IsSuccess)
            {
                return BadRequest(res.Error);
            }

            return Ok("Teacher Registration Successfully !");

        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetTeacherAll()
        {
            var results = await _service.GetAllTeachers();

            if (!results.IsSuccess)
            {
                return NotFound(results.Error);
            }
            return Ok(results.Data);
        }

        [Authorize(Roles = "Admin,Teacher")]
        [HttpGet("{id}")]
        public async Task<IActionResult> TeacherById(int id)
        {
            var res = await _service.GetTeacher(id);

            if (User.IsInRole("Teacher"))
            {
                var authRes = await _authorizationService.AuthorizeAsync(User, id, "TeacherOwnDataPolicy");

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

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTeacher(int id)
        {
            var res= await _service.DeleteTeacher(id);
            if (!res.IsSuccess)
            {
                return NotFound(res.Error);
            }
            return Ok("Teacher Delete Successfully !");
        }


        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTeacher(int id, TeacherUpdateDto dto)
        {
            var res= await _service.UpdateTeacher(id, dto);
            if (!res.IsSuccess)
            {
                return NotFound(res.Error);
            }

            return Ok("Teacher Update Successfully !");
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("class/assign")]
        public async Task<IActionResult> AssignAssessments(TeacherClassAssignDto dto)
        {
            var res=await _assignmentService.CreateAssignmentTask(dto);

            if (!res.IsSuccess)
            {
                return BadRequest(res.Error);
            }

            return Ok("Assign Successfully!");
        }

        [Authorize(Roles = "Admin,Teacher")]
        [HttpGet("class/assign/{id}")]
        public async Task<IActionResult> AssignmentById(int id)
        {
            var task=await _assignmentService.AssignmentById(id);

            if (User.IsInRole("Teacher"))
            {
                var authRes = await _authorizationService.AuthorizeAsync(User, task.Data!.TeacherId, "TeacherOwnDataPolicy");

                if (!authRes.Succeeded)
                    return Forbid();

                return Ok(task.Data);
            }

            if (!task.IsSuccess)
            {
                return NotFound(task.Error);
            }
            return Ok(task.Data);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("class/assign/{id}")]
        public async Task<IActionResult> AssignmentTerminate(int id)
        {
            var task = await _assignmentService.AssignmentTerminate(id);
            if (!task.IsSuccess)
            {
                return NotFound(task.Error);
            }
            return Ok("Assignment is Terminated!");
        }

        [Authorize(Roles = "Admin,Teacher")]
        [HttpGet("class/teacher/{id}")]
        public async Task<IActionResult> AssignmentByTeacher(int id)
        {
            var tasks=await _assignmentService.AssignmentBYTeacher(id);

            if (User.IsInRole("Teacher"))
            {
                var authRes = await _authorizationService.AuthorizeAsync(User, id, "TeacherOwnDataPolicy");

                if (!authRes.Succeeded)
                    return Forbid();

                return Ok(tasks.Data);
            }

            if (!tasks.IsSuccess)
            {
                return NotFound(tasks.Error);
            }
            return Ok(tasks.Data);   
        }

        [Authorize(Roles = "Admin,Teacher")]
        [HttpGet("class/{id}")]
        public async Task<IActionResult> AssignmentByClass(int id)
        {
            var tasks = await _assignmentService.AssignmentByClass(id);

            if (User.IsInRole("Teacher"))
            {
                var authRes = await _authorizationService.AuthorizeAsync(User, id, "AssignClassesOnly");

                if (!authRes.Succeeded)
                    return Forbid();

                return Ok(tasks.Data);
            }

            if (!tasks.IsSuccess)
            {
                return NotFound(tasks.Error);
            }
            return Ok(tasks.Data);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("subject/assign")]
        public async Task<IActionResult> AssignSubject(AssignTeacherSubjectDto teacherSubjectClass)
        {
            var res=await _assignSubjectService.AssignSubject(teacherSubjectClass);
            if (!res.IsSuccess)
            {
                return BadRequest(res.Error);
            }

            return Ok("Teacher assign subject is successfully!");
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("subject/assign")]
        public async Task<IActionResult> GetAll()
        {
            var res=await _assignSubjectService.GetAll();

            if (!res.IsSuccess)
            {
                return NotFound(res.Error);
            }

            return Ok(res.Data);
        }

        [Authorize(Roles = "Admin,Teacher")]
        [HttpGet("subject/teacher/{id}")]
        public async Task<IActionResult> GetByTeacher(int id)
        {
            var res = await _assignSubjectService.GetByTeacher(id);

            if (User.IsInRole("Teacher"))
            {
                var authRes = await _authorizationService.AuthorizeAsync(User,id, "TeacherOwnDataPolicy");

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

        [Authorize(Roles = "Admin")]
        [HttpDelete("subject/assign/{id}")]
        public async Task<IActionResult> RemovePermission(int id)
        {
            var res=await _assignSubjectService.RemovePermission(id);

            if (!res.IsSuccess)
            {
                return NotFound(res.Error);
            }

            return NoContent();

        }

        [Authorize(Roles = "Admin")]
        [HttpPut("subject/assign/{id}")]
        public async Task<IActionResult> Update(int id)
        {
            var res=await _assignSubjectService.TerminateSubjectAssign(id);

            if (!res.IsSuccess)
            {
                return BadRequest(res.Error);
            }

            return NoContent();
        }

        [Authorize(Roles = "Admin,Teacher")]
        [HttpGet("subject/assign/{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var res = await _assignSubjectService.GetById(id);

            var req = new AssignSubjectResourceDto();

            req.ClassId = res.Data!.ClassId;
            req.SubjectId = res.Data.subjectId;

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

        [Authorize(Roles = "Admin,Teacher")]
        [HttpGet("subject/{subjectId}/class/{classId}")]
        public async Task<IActionResult> GetByClassAndSubject(int classId,int subjectId)
        {
            var res = await _assignSubjectService.GetByClassAndSubject(classId,subjectId);

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
