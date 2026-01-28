using Backend.Models;

namespace Backend.DTOs
{
    public class LoginRes
    {
        public string ? token {  get; set; }
        public string? username { get; set; }

        public string? email { get; set; }

        public UserRole role { get; set; }

        public int? teacherId { get; set; }

        public int? studentId { get; set; }
    }
}
