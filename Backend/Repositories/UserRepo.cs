using Backend.Data;
using Backend.Models;
using Backend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class UserRepo : IUserRepo

    {
        private readonly AppDbContext _context;
        public UserRepo(AppDbContext context)
        {
            _context = context;
        }
        public async Task AddUser(User user)
        {
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
        }

        public async Task<User?> UserByEmail(string email)
        { 
            return await _context.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<User?> UserById(int id)
        {
            return await _context.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Id == id);
        }

        public async Task DeleteUser(User user)
        {
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
        }
    }
}
