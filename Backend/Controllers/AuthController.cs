using Backend.DTOs;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

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
    }
}
