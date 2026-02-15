using Backend.DTOs.User;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _service;

        public AuthController(IUserService service)
        {
            _service = service;
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            var res=await _service.AddUserToRepo(dto);
            if (!res.IsSuccess)
            {
                return BadRequest(res.Error);
            }
            return Ok(res.Data);
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var token = await _service.LoginByEmail(dto);
            if (!token.IsSuccess)
            {
                return BadRequest(token.Error);
            }
            return Ok(token.Data);
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> Me()
        {
            var userIdClaim = User.FindFirst("userId")?.Value;

            if (string.IsNullOrEmpty(userIdClaim))
                return Unauthorized("Invalid token");

            if (!int.TryParse(userIdClaim, out int userId))
                return Unauthorized("Invalid token");

            var result = await _service.UserByID(userId);

            if (!result.IsSuccess)
                return NotFound(result.Error);

            var user = result.Data!;

            return Ok(new
            {
                userId = user.Id,
                email = user.Email,
                role = user.Role,
                teacherId = user.Teacher?.Id,
                studentId = user.Student?.Id
            });
        }

       
        [HttpGet("ping")]
        public IActionResult Ping()
        {
            return Ok("TOKEN WORKS");
        }

    }
}
