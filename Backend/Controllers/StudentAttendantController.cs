using Backend.DTOs;
using Backend.Helper;
using Backend.Models;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentAttendantController : ControllerBase
    {
        private readonly IStudentAttendantService _service;

        public StudentAttendantController(IStudentAttendantService service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<IActionResult> Attendances(List<StudentAttendances> studentAttendances)
        {
            var res=await _service.Attendances(studentAttendances);

            if (!res.IsSuccess)
            {
                return BadRequest(res.Error);
            }

            return Ok("Attendant mark Successfully!");
        }

        [HttpGet("student/{studentId}")]
        public async Task<IActionResult> AttendanceByStudent(int studentId)
        {
            var res = await _service.AttendanceByStudent(studentId);

            if (!res.IsSuccess)
            {
                return NotFound(res.Error);
            }

            return Ok(res.Data);
        }

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

        [HttpGet("class/{classId}")]
        public async Task<IActionResult> ClassAttendant(int classId, [FromQuery] DateOnly date)
        {
            var res = await _service.ClassAttendant(classId,date);

            if (!res.IsSuccess)
            {
                return NotFound(res.Error);
            }

            return Ok(res.Data);
        }

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

        [HttpGet]
        public async Task<IActionResult> AttendantByDate([FromQuery] DateOnly date)
        {
            var res = await _service.AttendantByDate(date);

            if (!res.IsSuccess)
            {
                return NotFound(res.Error);
            }

            return Ok(res.Data);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAttendant(int id,StudentAttendances studentAttendances)
        {
            var res = await _service.UpdateAttendant(id,studentAttendances);

            if (!res.IsSuccess)
            {
                return BadRequest(res.Error);
            }

            return NoContent();
        }
    }
}
