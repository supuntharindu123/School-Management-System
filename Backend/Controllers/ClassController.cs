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

            if (!clz.IsSuccess)
            {
                return NotFound(clz.Error);
            }

            return Ok(clz.Data);
        }

        [HttpPost]
        public async Task<IActionResult> CreateClass(Class clz)
        {
            var res= await _classService.CreateClass(clz);
            return Ok("Class Creation Successfully!");
        }

        [HttpGet("grade/{id}")]
        public async Task<IActionResult> GetClassByGrade(int id) {
            var clz = await _classService.GetClassByGrade(id);
            if (!clz.IsSuccess)
            {
                return BadRequest(clz.Error);
            }
            return Ok(clz.Data);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteClass(int id)
        {
             var res= await _classService.RemoveClass(id);

            if(!res.IsSuccess)
            {
                return NotFound(res.Error);
            }

            return NoContent();
        }

        [HttpGet]
        public async Task<IActionResult> GetClasses()
        {
            var clz = await _classService.GetClasses();
            if (!clz.IsSuccess)
            {
                return BadRequest(clz.Error);
            }
            return Ok(clz.Data);
        }
    }
}
