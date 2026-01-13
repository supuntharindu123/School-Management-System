using Backend.DTOs;
using Backend.Models;

namespace Backend.Services.Interfaces
{
    public interface IUserService
    {
        public Task<User> AddUserToRepo(RegisterDto dto);
        public Task<LoginRes> LoginByEmail(LoginDto dto);

        public Task<User> UserByID(int id);

        public Task DeleteUser(int id);
    }
}
