using Backend.DTOs.User;
using Backend.Helper;
using Backend.Models;

namespace Backend.Services.Interfaces
{
    public interface IUserService
    {
        public Task<Result<User?>> AddUserToRepo(RegisterDto dto);
        public Task<Result<LoginRes>> LoginByEmail(LoginDto dto);

        public Task<Result<User?>> UserByID(int id);

        public Task<Result> DeleteUser(int id);
    }
}
