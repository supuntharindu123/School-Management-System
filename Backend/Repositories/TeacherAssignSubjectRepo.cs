using Backend.Data;
using Backend.Models;
using Backend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class TeacherAssignSubjectRepo : ITeacherAssignSubjectRepo
    {
        private readonly AppDbContext _context;

        public TeacherAssignSubjectRepo(AppDbContext context)
        {
            _context = context;
        }

        public async Task AssignSubject(TeacherSubjectClass teacherSubjectClass)
        {
            _context.TeacherSubjectClasses.Add(teacherSubjectClass);
            await _context.SaveChangesAsync();
        }

        public async Task<List<TeacherSubjectClass>> GetAll()
        {
            return await _context.TeacherSubjectClasses.Include(t => t.Subject).Include(t =>t.Class).Include(t => t.Teacher).ToListAsync();
        }

        public async Task<TeacherSubjectClass?> GetById(int id)
        {
            return await _context.TeacherSubjectClasses.Include(t => t.Subject).Include(t => t.Class).Include(t => t.Teacher).FirstOrDefaultAsync(t=>t.Id==id);
        }

        public async Task<List<TeacherSubjectClass>> GetByTeacher(int id)
        {
            return await _context.TeacherSubjectClasses.Where(t=>t.TeacherId==id).Include(t=>t.Subject).Include(t=>t.Teacher).Include(t=>t.Class).ToListAsync();
        }

        public async Task RemovePermission(TeacherSubjectClass teacherSubjectClass)
        {
            _context.TeacherSubjectClasses.Remove(teacherSubjectClass);
            await _context.SaveChangesAsync();
        }

        public async Task Update()
        {
            await _context.SaveChangesAsync();
        }

        public async Task<bool> IsExist(int teacherId, int classId, int subjectId)
        {
            return await _context.TeacherSubjectClasses.Where(t=>t.IsActive==true).AnyAsync(t =>
                (t.TeacherId == teacherId && t.ClassId == classId && t.SubjectId == subjectId)
                || (t.ClassId == classId && t.SubjectId == subjectId)
            );
        }

        public async Task<List<TeacherSubjectClass>> GetByClassAndSubject(int classId, int subjectId)
        {
            return await _context.TeacherSubjectClasses.Where(t=>t.ClassId==classId && t.SubjectId==subjectId).Include(t=>t.Teacher).Include(t=>t.Subject).Include(t=>t.Class).ToListAsync();
        }


    }
}
