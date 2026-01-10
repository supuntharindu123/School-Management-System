using Backend.DTOs;

namespace Backend.Services.Interfaces
{
    public interface IUserService
    {
        public Task AddUserToRepo(RegisterDto dto);
        public Task<LoginRes> LoginByEmail(LoginDto dto);
    }
}
