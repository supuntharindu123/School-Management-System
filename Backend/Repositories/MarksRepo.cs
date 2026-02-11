using Backend.Data;
using Backend.Models;
using Backend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class MarksRepo:IMarksRepo
    {
        private readonly AppDbContext _context;

        public  MarksRepo(AppDbContext context)
        {
            _context = context;
        }

        public async Task AddMarks(Marks marks)
        {
            _context.Marks.Add(marks);
            await _context.SaveChangesAsync(); 
        }

        //public async Task UpdateMark()
        //{
        //    await _context.SaveChangesAsync();
        //}

        //public async Task DeleteMark(Marks marks)
        //{
        //    _context.Marks.Remove(marks);
        //    await _context.SaveChangesAsync();
        //}


        public async Task<List<Marks>> GetMarksByGrade(int examId, int gradeId)
        {
            return await _context.Marks.Where(m => m.ExamId == examId && m.GradeId == gradeId).ToListAsync();
        }

        public async Task<List<Marks>> GetMarksByClass(int examId, int classId)
        {
            return await _context.Marks.Where(m => m.ExamId == examId && m.ClassId == classId).ToListAsync();
        }

        public Task<List<Marks>> GetMarksForStudent(int studentId)
        {
            throw new NotImplementedException();
        }
    }
}
