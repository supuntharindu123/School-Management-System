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
        private readonly Passwordhash _hasher;
        public UserService(IUserRepo repo, IMapper mapper, TokenGenerator token, Passwordhash hasher) { 
            _repo = repo;
            _mapper = mapper;
            _token = token;
            _hasher = hasher;
        }
        public async Task<User> AddUserToRepo(RegisterDto dto)
        {
            if (await _repo.UserByEmail(dto.Email!)!=null) {
                throw new Exception("Email already exists");
            }

            var user = _mapper.Map<User>(dto);
            user.Password = _hasher.Hash(dto.Password!, user);

            await _repo.AddUser(user);

            return user;
        }

        public async Task<LoginRes> LoginByEmail(LoginDto dto)
        {
            var user = await _repo.UserByEmail(dto.Email!);
            if (user == null) {
                throw new Exception("User Not found");
            }

            var result = _hasher.Verifypwd(dto.Password!, user.Password!, user);

            if(!result)
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
