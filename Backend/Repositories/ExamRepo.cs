using Backend.Data;
using Backend.Models;
using Backend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class ExamRepo:IExamRepo
    {
        private readonly AppDbContext _context;

        public ExamRepo(AppDbContext context)
        {
            _context = context;
        }

        public async Task CreateExam(Exam exam)
        {
            _context.Exams.Add(exam);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteExam(Exam exam)
        {
            _context.Exams.Remove(exam);
            await _context.SaveChangesAsync();
        }

        public async Task<Exam?> GetExamById(int id)
        {
            return await _context.Exams.Include(e => e.Grade).Include(e => e.AcademicYear).FirstOrDefaultAsync(e => e.Id == id);
        }

        public async Task<List<Exam>> GetExams()
        {
            return await _context.Exams.Include(e => e.Grade).Include(e => e.AcademicYear).ToListAsync();   
        }

        public async Task UpdateExam(Exam exam)
        {
            _context.Exams.Update(exam);
            await _context.SaveChangesAsync();
        }
    }
}
