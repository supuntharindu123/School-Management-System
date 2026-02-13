using Backend.Data;
using Backend.Models;
using Backend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;

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
            return await _context.Marks.Where(m => m.ExamId == examId && m.GradeId == gradeId).Include(m=>m.Exam).ThenInclude(e=>e.AcademicYear).Include(m => m.Student).ToListAsync();
        }

        public async Task<List<Marks>> GetMarksByClass( int classId)
        {
            return await _context.Marks.Where(m =>  m.ClassId == classId).Include(m => m.Exam).ThenInclude(e => e.AcademicYear).Include(m=>m.Student).ToListAsync();
        }

        public async Task<List<Marks>> GetMarksForStudent(int studentId)
        {
            return await _context.Marks.Where(m=>m.StudentId==studentId).Include(m => m.Exam).ThenInclude(e => e.AcademicYear).ToListAsync();
        }

        public async Task<List<Marks>> GetMarksByClassAndSubject(int classId, int subjectId)
        {
            return await _context.Marks.Where(m => m.ClassId == classId && m.SubjectId==subjectId).Include(m => m.Exam).ThenInclude(e => e.AcademicYear).ToListAsync();

        }

        public async Task<IDbContextTransaction> BeginTransactionAsync()
        {
            return await _context.Database.BeginTransactionAsync();
        }

        public async Task<Marks?> GetMarksByExamClassSubjectStudent(int examId, int classId,int subjectId, int studentId)
        {
            return await _context.Marks.Where(m => m.ExamId == examId && m.ClassId == classId && m.SubjectId == subjectId && m.StudentId == studentId).FirstOrDefaultAsync();
        }

        public async Task UpdateMarks()
        {
            await _context.SaveChangesAsync();
        }
    }
}
