using Backend.DTOs.Exam;
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
    public class ExamController : ControllerBase
    {
        private readonly IExamServices _services;

        public ExamController(IExamServices services)
        {
            _services = services;
        }


        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> CreateExam(Exam exam)
        {
            await _services.CreateExam(exam);

            return Ok("Exam Creation Successfully!");
        }

        [Authorize(Roles = "Admin")]
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

        [Authorize(Roles = "Admin")]
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

        [Authorize(Roles = "Admin")]
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

        [Authorize(Roles = "Admin,Teacher")]
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

        [Authorize(Roles = "Admin")]
        [HttpPost("assign/grade")]
        public async Task<IActionResult> AssignGradesForExam( [FromBody] AssignExamGradeReqDto dto)
        {
            var res = await _services.AssignGradesForExam(dto.ExamId,dto.GradeIds);

            if (!res.IsSuccess)
            {
                return BadRequest(res.Error);
            }

            return Ok("Success assign grades for exam!");
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("assign/subject")]
        public async Task<IActionResult> AssignSubjectsForExam(AssignExamGradeSubjectReqDto dto)
        {
            var res = await _services.AssignSubjectsForExam(dto.ExamId,dto.GradeId,dto.SubjectIds);

            if (!res.IsSuccess)
            {
                return BadRequest(res.Error);
            }

            return Ok("Success assign subject for exam!");
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("detailed/{id}")]
        public async Task<IActionResult> ExamDetails(int id)
        {
            var res= await _services.ExamDetails(id);

            if (!res.IsSuccess)
            {
                return BadRequest(res.Error);
            }

            return Ok(res.Data);
        }

    }
}
