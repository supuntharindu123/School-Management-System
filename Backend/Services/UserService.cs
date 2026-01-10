using AutoMapper;
using Backend.DTOs;
using Backend.Helper;
using Backend.Models;
using Backend.Repositories.Interfaces;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Identity;

namespace Backend.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepo _repo;
        private readonly IMapper _mapper;
        private readonly TokenGenerator _token;
        public UserService(IUserRepo repo, IMapper mapper, TokenGenerator token) { 
            _repo = repo;
            _mapper = mapper;
            _token = token;
        }
        public async Task AddUserToRepo(RegisterDto dto)
        {
            if (await _repo.UserByEmail(dto.Email!)!=null) {
                throw new Exception("Email already exists");
            }

            var user=_mapper.Map<User>(dto);

            var hashpwd = new PasswordHasher<User>();
            user.Password = hashpwd.HashPassword(user, dto.Password!);

            await _repo.AddUser(user);
        }

        public async Task<LoginRes> LoginByEmail(LoginDto dto)
        {
            var user = await _repo.UserByEmail(dto.Email!);
            if (user == null) {
                throw new Exception("User Not found");
            }

            var hasher=new PasswordHasher<User>();
            var result = hasher.VerifyHashedPassword(user, user.Password!, dto.Password!);

            if(result == PasswordVerificationResult.Failed)
            {
                throw new Exception("Password Is Incorrect!");
            }

            return new LoginRes
            {
                token = _token.GenerateToken(user),
                username=user.Username,
                email=user.Email,
                role = user.Role,
            }; 


        }
    }
}
