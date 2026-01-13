using Backend.DTOs;
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
        public TeacherController(ITeacherService service) {
            _service = service;
        }

        [HttpPost("add")]
        public async Task<IActionResult> CreateTeacher(TeacherCreateDto dto)
        {
            await _service.CreateTeacher(dto);
            return Ok("Teacher Registration Successfully !");

        }

        [HttpGet]
        public async Task<IActionResult> GetStudentAll()
        {
            var results = await _service.GetAllTeachers();
            return Ok(results);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStudent(int id)
        {
            await _service.DeleteTeacher(id);
            return Ok("Teacher Delete Successfully !");
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStudent(int id, TeacherUpdateDto dto)
        {
            await _service.UpdateTeacher(id, dto);
            return Ok("Teacher Update Successfully !");
        }
    }
}
