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

        public async Task<Teacher?> GetTeacherById(int teacherId)
        {
            return await _context.Teachers
                .Include(t => t.User)
                .Include(t => t.AssignTasks)
                    .ThenInclude(a => a.Class)
                .Include(t => t.TeacherSubjectClass)
                    .ThenInclude(tsc => tsc.Subject)
                .Include(t => t.TeacherSubjectClass)
                    .ThenInclude(tsc => tsc.Class)
                .Include(t => t.TeacherSubjectClass)
                .FirstOrDefaultAsync(t => t.Id == teacherId);
        }

        public async Task<List<Teacher>> GetTeachers()
        {

            return await _context.Teachers
                .Include(t => t.User)
                .Include(t => t.AssignTasks)
                    .ThenInclude(a => a.Class)
                .Include(t => t.TeacherSubjectClass)
                    .ThenInclude(tsc => tsc.Subject)
                .Include(t => t.TeacherSubjectClass)
                    .ThenInclude(tsc => tsc.Class)
                .Include(t => t.TeacherSubjectClass)
                .ToListAsync();
        }

        public async Task UpdateTeacher(Teacher teacher)
        {

            _context.Teachers.Update(teacher);
            await _context.SaveChangesAsync();
        }
    }
}
