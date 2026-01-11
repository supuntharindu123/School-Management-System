using Backend.Data;
using Backend.Models;
using Backend.Repositories.Interfaces;

namespace Backend.Repositories
{
    public class TeacherRepo : ITeacherRepo
    {
        private readonly AppDbContext _context;

        public TeacherRepo(AppDbContext context)
        {
            _context = context;
        }
        public async Task AddTeacher(Teacher teacher)
        {
            await _context.Teachers.AddAsync(teacher);
            await _context.SaveChangesAsync();
        }
    }
}
