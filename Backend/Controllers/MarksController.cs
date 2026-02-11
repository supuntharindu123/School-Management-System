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
        public async Task<IActionResult> AddMarks(Marks marks)
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
    }
}
