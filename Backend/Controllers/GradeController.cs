using Backend.Services.Interfaces;
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

    }
}
