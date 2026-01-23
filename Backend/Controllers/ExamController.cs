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
    public class ExamController : ControllerBase
    {
        private readonly IExamServices _services;

        public ExamController(IExamServices services)
        {
            _services = services;
        }


        [HttpPost]
        public async Task<IActionResult> CreateExam(Exam exam)
        {
            await _services.CreateExam(exam);

            return Ok("Exam Creation Successfully!");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteExam(int id )
        {
            var res = await _services.DeleteExam(id);

            if (!res.IsSuccess)
            {
                return BadRequest(res.Error);
            }

            return NoContent();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateExam(int id,ExamUpdateDto exam)
        {
            var res = await _services.UpdateExam(id,exam);

            if (!res.IsSuccess)
            {
                return BadRequest(res.Error);
            }

            return NoContent();
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetExamById(int id)
        {
            var res = await _services.GetExamById(id);

            if (!res.IsSuccess)
            {
                return NotFound(res.Error);
            }

            return Ok(res.Data);
        }


        [HttpGet]
        public async Task<IActionResult> GetExams()
        {
            var res = await _services.GetExams();

            if (!res.IsSuccess)
            {
                return NotFound(res.Error);
            }

            return Ok(res.Data);
        }
    }
}
