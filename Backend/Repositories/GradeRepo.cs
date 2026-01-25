using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Backend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class GradeRepo:IGradeRepo
    {
        private readonly AppDbContext _context;
        public GradeRepo(AppDbContext context) {
            _context = context;
        }

        public Task AddGrade(Grade grade)
        {
            throw new NotImplementedException();
        }

        public async Task<List<Grade>> GetGrades()
        {
            return await _context.Grades.ToListAsync();
        }

        public async Task<Grade?> GradeById(int id)
        {
            return await _context.Grades.AsTracking().FirstOrDefaultAsync(g => g.Id == id);
            
        }

        public async Task<List<GradeSummaryDto>> GetGradeSummaries()
        {
            // Build summaries per grade with counts of classes and students
            var summaries = await _context.Grades
                .Select(g => new GradeSummaryDto
                {
                    GradeId = g.Id,
                    GradeName = g.GradeName,
                    ClassCount = _context.Classes.Count(c => c.GradeId == g.Id),
                    StudentCount = _context.Students
                        .Count(s => _context.Classes
                            .Where(c => c.GradeId == g.Id)
                            .Select(c => c.Id)
                            .Contains(s.ClassId))
                })
                .OrderBy(x => x.GradeName)
                .ToListAsync();

            return summaries;
        }
    }
}
