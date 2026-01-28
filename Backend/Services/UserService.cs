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
        public async Task<Result<User?>> AddUserToRepo(RegisterDto dto)
        {
            if (await _repo.UserByEmail(dto.Email!)!=null) {
                return Result<User?>.Failure("Email Already Exists!");
            }

            var user = _mapper.Map<User>(dto);
            user.Password = _hasher.Hash(dto.Password!, user);

            await _repo.AddUser(user);

            return Result<User?>.Success(user);
        }

        public async Task<Result<LoginRes>> LoginByEmail(LoginDto dto)
        {
            var user = await _repo.UserByEmail(dto.Email!);
            if (user == null)
            {
                return Result<LoginRes>.Failure("User Not Found!");
            }

            var result = _hasher.Verifypwd(dto.Password!, user.Password!, user);

            if (!result)
            {
                return Result<LoginRes>.Failure("Password is incorrect!");
            }

            return Result<LoginRes>.Success(new LoginRes
            {
                token = _token.GenerateToken(user),
                username = user.Username,
                email = user.Email,
                role = user.Role,
                teacherId=user.Teacher?.Id,
                studentId=user.Student?.Id,
            }); 
        }


        public async Task<Result<User?>> UserByID(int id) {
            var user=await _repo.UserById(id);
            if (user == null) {
                return Result<User?>.Failure("User Not Found");
            }

            return Result<User?>.Success(user);
        }


        public async Task<Result> DeleteUser(int id)
        {
            var user = await _repo.UserById(id);
            if (user == null)
            {
                return Result.Failure("User Not Found");
            }
            await _repo.DeleteUser(user);

            return Result.Success();
        }


    }
}
