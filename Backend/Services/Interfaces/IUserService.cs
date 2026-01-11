using Backend.DTOs;
using Backend.Models;

namespace Backend.Services.Interfaces
{
    public interface IUserService
    {
        public Task<User> AddUserToRepo(RegisterDto dto);
        public Task<LoginRes> LoginByEmail(LoginDto dto);
    }
}
