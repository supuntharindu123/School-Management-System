using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("/api/[controller]")]
    [ApiController]
    public class GradeController:ControllerBase
    {
        private readonly IGradeService _service;

        public GradeController(IGradeService service)
        {
            _service = service;
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetGrade(int id)
        {
            var grade=await _service.GetGrade(id);
            if (!grade.IsSuccess)
            {
                return NotFound(grade.Error);
            }
            return Ok(grade.Data);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetGrades()
        {
            var grades = await _service.GetAllGrades();
            if (!grades.IsSuccess)
            {
                return NotFound(grades.Error);
            }
            return Ok(grades.Data);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("summary")]
        public async Task<IActionResult> GetGradeSummaries()
        {
            var summaries = await _service.GetSummaries();
            if (!summaries.IsSuccess)
            {
                return NotFound(summaries.Error);
            }
            return Ok(summaries.Data);
        }

    }
}
