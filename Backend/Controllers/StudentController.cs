using Backend.DTOs;
using Backend.Services.Interfaces;
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
        public StudentController(IStudentService service) { 
            _service = service;
        
        }

        [HttpPost("add")]
        public async Task<IActionResult> CreateStudent(StudentCreateDto dto)
        {
            await _service.CreateStudent(dto);
            return Ok("Student Registration Successfully !");
        }

        [HttpGet]
        public async Task<IActionResult> GetStudentAll()
        {
            var results=await _service.AllStudents();
            return Ok(results);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStudent(int id) { 
            await _service.DeleteStudent(id);
            return Ok("Student Delete Successfully !");
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStudent(int id, StudentUpdateDto dto)
        {
            await _service.UpdateStudent(id, dto);
            return Ok("Student Update Successfully !");
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetStudent(int id) {
            var student=await _service.StudentById(id);
            return Ok(student);
        }
    }
}
