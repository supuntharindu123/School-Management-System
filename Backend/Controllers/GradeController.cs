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
            return Ok(grade);
        }

        [HttpGet]
        public async Task<IActionResult> GetGrades()
        {
            var grades = await _service.GetAllGrades();
            return Ok(grades);
        }

    }
}
