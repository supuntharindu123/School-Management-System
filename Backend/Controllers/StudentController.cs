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
            var res=await _service.CreateStudent(dto);
            if(!res.IsSuccess)
            {
                return BadRequest(res.Error);
            }
            return Ok("Student Registration Successfully !");
        }

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

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStudent(int id) { 
            var res=await _service.DeleteStudent(id);
            if(!res.IsSuccess)
            {
                return NotFound(res.Error);
            }
            return Ok("Student Delete Successfully !");
        }

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

        [HttpGet("{id}")]
        public async Task<IActionResult> GetStudent(int id) {
            var student=await _service.StudentById(id);
            if (!student.IsSuccess)
            {
                return NotFound(student.Error);
            }
            return Ok(student.Data);
        }

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
    }
}
