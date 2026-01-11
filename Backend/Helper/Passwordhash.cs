using Backend.Models;
using Microsoft.AspNetCore.Identity;

namespace Backend.Helper
{
    public class Passwordhash
    {
        private readonly PasswordHasher<object> _hasher=new();

        public string Hash(string password, User user)
        {
            var hashpwd = _hasher.HashPassword(user, password);
            return hashpwd;
        }

        public bool Verifypwd(string password, string hashpwd, User user)
        {
            var verify=_hasher.VerifyHashedPassword(user,hashpwd,password);
            return verify==PasswordVerificationResult.Success;
        }
    }
}
