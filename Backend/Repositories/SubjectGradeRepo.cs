using Backend.Data;
using Backend.Models;
using Backend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class SubjectGradeRepo : ISubjectGradeRepo
    {
        private readonly AppDbContext _context;
        public SubjectGradeRepo(AppDbContext context) { 
            _context = context;
        }
        public async Task Add(SubjectGrade subjectGrade)
        {
            _context.SubjectGrades.Add(subjectGrade);
            await _context.SaveChangesAsync();
        }

        public async Task<SubjectGrade?> GetById(int id)
        {
            return await _context.SubjectGrades.AsNoTracking().Include(s => s.Subject).Include(s => s.Grade).FirstOrDefaultAsync(s => s.Id == id);
        }

        public async Task<List<SubjectGrade>> GetByGrade(int gradeId)
        {
           return await _context.SubjectGrades.Where(s=>s.GradeID== gradeId).Include(s=>s.Grade).Include(s=>s.Subject).ToListAsync();
        }

        public async Task Remove(SubjectGrade subjectGrade)
        {
            _context.SubjectGrades.Remove(subjectGrade);
            await _context.SaveChangesAsync();
        }
    }
}
