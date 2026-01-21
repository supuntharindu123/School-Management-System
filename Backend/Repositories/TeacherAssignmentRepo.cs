using Backend.Data;
using Backend.Models;
using Backend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class TeacherAssignmentRepo:ITeacherAssignmentRepo
    {
        private readonly AppDbContext _context;

        public TeacherAssignmentRepo(AppDbContext context)
        {
            _context = context;
        }

        public async Task<TeacherClassAssign?> AssignmentById(int TeacherId)
        {
            return await _context.TeacherClassAssign.Include(t=>t.Class).Include(t => t.Teacher).FirstOrDefaultAsync(t=>t.Id==TeacherId && t.IsActive==true);
        }

        public async Task<TeacherClassAssign?> AssignmentByClass(int ClassId)
        {
            return await _context.TeacherClassAssign.Include(t => t.Class).Include(t => t.Teacher).FirstOrDefaultAsync(t => t.Id == ClassId && t.IsActive == true);
        }

        public async Task CreateAssignment(TeacherClassAssign task)
        {
             _context.TeacherClassAssign.Add(task);
            await _context.SaveChangesAsync();
        }

        public async Task<List<TeacherClassAssign>> GetAssignmentFromTeacher(int TeacherId)
        {
            return await _context.TeacherClassAssign.Where(t => t.TeacherId == TeacherId).Include(t => t.Class).ToListAsync();
        }
    }
}
