using Backend.Models;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("/api/[controller]")]
    [ApiController]
    public class ClassController:ControllerBase
    {
        private readonly IClassService _classService;
        private readonly IAuthorizationService _authorizationService;

        public ClassController(IClassService classService, IAuthorizationService authorizationService)
        {
            _classService = classService;
            _authorizationService = authorizationService;
        }

        [Authorize(Roles = "Admin,Teacher")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetClass(int id)
        {

            if (User.IsInRole("Admin"))
            {
                var adminRes = await _classService.GetClassById(id);

                if (!adminRes.IsSuccess)
                    return NotFound(adminRes.Error);

                return Ok(adminRes.Data);
            }

            var authResult = await _authorizationService.AuthorizeAsync(User, id, "AssignClassesOnly");

            if (!authResult.Succeeded)
            {
                return Forbid();
            }

           var clz=await _classService.GetClassById(id);

            if (!clz.IsSuccess)
            {
                return NotFound(clz.Error);
            }

            return Ok(clz.Data);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> CreateClass(Class clz)
        {
            var res= await _classService.CreateClass(clz);
            return Ok("Class Creation Successfully!");
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("grade/{id}")]
        public async Task<IActionResult> GetClassByGrade(int id) {
            var clz = await _classService.GetClassByGrade(id);
            if (!clz.IsSuccess)
            {
                return BadRequest(clz.Error);
            }
            return Ok(clz.Data);
        }

        [Authorize(Roles = "Admin")]
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

        [Authorize(Roles = "Admin")]
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
