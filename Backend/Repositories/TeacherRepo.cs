using Backend.Data;
using Backend.Models;
using Backend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

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

        public async Task DeleteTeacher(Teacher teacher)
        {

            _context.Teachers.Remove(teacher);
            await _context.SaveChangesAsync();
        }

        public async Task<Teacher?> GetTeacherById(int id)
        {
            return await _context.Teachers.Include(t=>t.User).Include(t=>t.AssignTasks).FirstOrDefaultAsync(t=>t.Id == id);
        }

        public async Task<List<Teacher>> GetTeachers()
        {

            return await _context.Teachers.Include(t => t.User).Include(t => t.AssignTasks).ToListAsync();
        }

        public async Task UpdateTeacher(Teacher teacher)
        {

            _context.Teachers.Update(teacher);
            await _context.SaveChangesAsync();
        }
    }
}
