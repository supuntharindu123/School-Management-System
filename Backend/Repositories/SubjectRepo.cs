using Backend.Data;
using Backend.Helper;
using Backend.Models;
using Backend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class SubjectRepo:ISubjectRepo
    {
        private readonly AppDbContext _context;

        public SubjectRepo(AppDbContext context)
        {
            _context = context;
        }

        public async Task AddSubject(Subject subject)
        {
            _context.Subjects.Add(subject);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteSubject(Subject subject)
        {
            _context.Subjects.Remove(subject);
            await _context.SaveChangesAsync();
        }

        public async Task<Subject?> GetSubjectById(int id)
        {
            return await _context.Subjects.FirstOrDefaultAsync(s=>s.Id == id);
        }

        public async Task<List<Subject>> GetSubjects()
        {
            return await _context.Subjects.Include(s=>s.SubjectGrade).ThenInclude(sg=>sg.Grade).ToListAsync();
        }

        public async Task UpdateSubject(Subject subject)
        {
            _context.Subjects.Update(subject);
            await _context.SaveChangesAsync();
        }

        public async Task<Subject?> SubjectExists(Subject subject)
        {
            return await _context.Subjects.AsNoTracking().FirstOrDefaultAsync(s=>s.SubjectName == subject.SubjectName || s.ModuleCode==subject.ModuleCode);
        }
    }
}
