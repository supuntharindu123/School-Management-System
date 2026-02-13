using Backend.DTOs.Marks;
using Backend.Helper;
using Backend.Models;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MarksController : ControllerBase
    {
        private readonly IMarksService _service;

        public MarksController(IMarksService service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<IActionResult> AddMarks(List<Marks> marks)
        {
            await _service.AddMarks(marks);
            return Ok("Marks Adding Successfully!");
        }

        [HttpGet("{examId}/{gradeId}")]
        public async Task<IActionResult> GetMarksByGrade(int examId,int gradeId)
        {
            var res=await _service.GetMarksByGrade(examId, gradeId);

            if (!res.IsSuccess)
            {
                return NotFound(res.Error);
            }

            return Ok(res.Data);
        }

        [HttpGet("{studentId}")]
        public async Task<IActionResult> GetMarksForStudent(int studentId)
        {
            var res = await _service.GetMarksForStudent(studentId);

            if (!res.IsSuccess)
            {
                return NotFound(res.Error);
            }

            return Ok(res.Data);
        }

        [HttpGet("class/{classId}")]
        public async Task<IActionResult> GetMarksByClass(int classId)
        {
            var res = await _service.GetMarksByClass(classId);

            if (!res.IsSuccess)
            {
                return NotFound(res.Error);
            }

            return Ok(res.Data);
        }

        [HttpGet("class/{classId}/subject/{subjectId}")]
        public async Task<IActionResult> GetMarksByClassandSubject(int classId, int subjectId)
        {
            var res = await _service.GetMarksByClass(classId);

            if (!res.IsSuccess)
            {
                return NotFound(res.Error);
            }

            return Ok(res.Data);
        }
    }
}
