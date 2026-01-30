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

        public async Task<TeacherClassAssign?> AssignmentById(int id)
        {
            return await _context.TeacherClassAssign.Include(t=>t.Class).Include(t => t.Teacher).FirstOrDefaultAsync(t=>t.Id==id && t.IsActive==true);
        }

        public async Task<List<TeacherClassAssign>> AssignmentByClass(int ClassId)
        {
            return await _context.TeacherClassAssign.Where(t=>t.ClassId==ClassId  && t.IsActive==true).Include(t => t.Class).Include(t => t.Teacher).ToListAsync();
        }

        public async Task CreateAssignment(TeacherClassAssign task)
        {
             _context.TeacherClassAssign.Add(task);
            await _context.SaveChangesAsync();
        }

        public async Task<List<TeacherClassAssign>> GetAssignmentFromTeacher(int TeacherId)
        {
            return await _context.TeacherClassAssign
            .Where(t => t.TeacherId == TeacherId)
            .Include(t => t.Class)
            .Include(t => t.Teacher)
            .OrderByDescending(t => t.IsActive)      
            .ThenByDescending(t => t.CreatedDate)    
            .ToListAsync();
        }

        public async Task AssignmentTerminate()
        {
            await _context.SaveChangesAsync();
        }

    }
}
