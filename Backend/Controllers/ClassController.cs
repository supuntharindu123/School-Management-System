using Backend.Models;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("/api/[controller]")]
    [ApiController]
    public class ClassController:ControllerBase
    {
        private readonly IClassService _classService;

        public ClassController(IClassService classService)
        {
            _classService = classService;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetClass(int id)
        {
           var clz=await _classService.GetClassById(id);
            return Ok(clz);
        }

        [HttpPost]
        public async Task<IActionResult> CreateClass(Class clz)
        {
            await _classService.CreateClass(clz);
            return Ok("Class Creation Successfully!");
        }

        [HttpGet("grade/{id}")]
        public async Task<IActionResult> GetClassByGrade(int id) {
            var clz = await _classService.GetClassByGrade(id);
            return Ok(clz);
        }
    }
}
