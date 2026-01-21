using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("/api/[controller]")]
    [ApiController]
    public class YearController:ControllerBase
    {
        private readonly IYearService _service;

        public YearController(IYearService service) { 
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetYears()
        {
            var years=await _service.GetAcademicYears();
            return Ok(years.Data);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetYear(int id)
        {
            var year = await _service.GetYear(id);
            return Ok(year.Data);
        }

    }
}
