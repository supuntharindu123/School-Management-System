using Backend.Models;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubjectController : ControllerBase
    {
        private readonly ISubjectService _services;

        public SubjectController(ISubjectService services)
        {
            _services = services;
        }

        [HttpPost]
        public async Task<IActionResult> AddSubject(Subject subject)
        {
            var res = await _services.AddSubject(subject);
            if (!res.IsSuccess)
            {
                return BadRequest(res.Error);
            }

            return Ok("Subject Adding Successfully!");
        }

        [HttpGet]
        public async Task<IActionResult> GetSubjects()
        {
            var res = await _services.GetSubjects();

            if (!res.IsSuccess)
            {
                return BadRequest(res.Error);
            }

            return Ok(res.Data);

        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetSubjectById(int id)
        {
            var res = await _services.GetSubjectByID(id);

            if (!res.IsSuccess)
            {
                return NotFound(res.Error);
            }

            return Ok(res.Data);

        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSubject(int id,Subject subject)
        {
            var res = await _services.UpdateSubject(id,subject);

            if (!res.IsSuccess)
            {
                return BadRequest(res.Error);
            }

            return NoContent();

        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Remove(int id)
        {
            var res = await _services.RemoveSubject(id);

            if (!res.IsSuccess)
            {
                return BadRequest(res.Error);
            }

            return NoContent();

        }
    }
}
