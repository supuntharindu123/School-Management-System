using Backend.Models;

namespace Backend.Repositories.Interfaces
{
    public interface IUserRepo
    {
        public Task<User?> UserByEmail(string email);
        public Task AddUser(User user);
        
    }
}
