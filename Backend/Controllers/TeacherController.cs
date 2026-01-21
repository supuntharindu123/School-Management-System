using Backend.DTOs;
using Backend.Models;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TeacherController : ControllerBase
    {
        private readonly ITeacherService _service;
        private readonly ITeacherAssignmentService _assignmentService;
        public TeacherController(ITeacherService service, ITeacherAssignmentService assignmentService) {
            _service = service;
            _assignmentService = assignmentService;
        }

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

        [HttpGet]
        public async Task<IActionResult> GetStudentAll()
        {
            var results = await _service.GetAllTeachers();

            if (!results.IsSuccess)
            {
                return NotFound(results.Error);
            }
            return Ok(results.Data);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStudent(int id)
        {
            var res= await _service.DeleteTeacher(id);
            if (!res.IsSuccess)
            {
                return NotFound(res.Error);
            }
            return Ok("Teacher Delete Successfully !");
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStudent(int id, TeacherUpdateDto dto)
        {
            var res= await _service.UpdateTeacher(id, dto);
            if (!res.IsSuccess)
            {
                return NotFound(res.Error);
            }

            return Ok("Teacher Update Successfully !");
        }


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

        [HttpGet("class/assign/{id}")]
        public async Task<IActionResult> AssignmentById(int id)
        {
            var task=await _assignmentService.AssignmentById(id);
            if (!task.IsSuccess)
            {
                return NotFound(task.Error);
            }
            return Ok(task.Data);
        }

        [HttpGet("class/teacher/{id}")]
        public async Task<IActionResult> AssignmentByTeacher(int id)
        {
            var tasks=await _assignmentService.AssignmentBYTeacher(id);
            if (!tasks.IsSuccess)
            {
                return NotFound(tasks.Error);
            }
            return Ok(tasks.Data);   
        }

        [HttpGet("class/{id}")]
        public async Task<IActionResult> AssignmentByClass(int id)
        {
            var tasks = await _assignmentService.AssignmentByClass(id);
            if (!tasks.IsSuccess)
            {
                return NotFound(tasks.Error);
            }
            return Ok(tasks.Data);
        }
    }
}
