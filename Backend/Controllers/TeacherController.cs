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
    }
}
