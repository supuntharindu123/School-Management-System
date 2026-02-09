using AutoMapper;
using Backend.Data;
using Backend.DTOs.Exam;
using Backend.Models;
using Backend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;

namespace Backend.Repositories
{
    public class ExamRepo:IExamRepo
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public ExamRepo(AppDbContext context,IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
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
            return await _context.Exams.Include(e => e.AcademicYear).FirstOrDefaultAsync(e => e.Id == id);
        }

        public async Task<List<Exam>> GetExams()
        {
            return await _context.Exams.Include(e => e.AcademicYear).ToListAsync();   
        }

        public async Task UpdateExam(Exam exam)
        {
            _context.Exams.Update(exam);
            await _context.SaveChangesAsync();
        }

        public async Task<IDbContextTransaction> BeginTransactionAsync()
        {
            return await _context.Database.BeginTransactionAsync();
        }

        public async Task AssignGradesForExam(ExamGrade examGrade)
        {
            _context.ExamGrades.Add(examGrade);
            await _context.SaveChangesAsync();
        }

        public Task<bool> CheckAssignGradesForExam(int examId, int gradeId, int subjectId)
        {
            var exist = _context.ExamGradeSubjects.AnyAsync(e => e.ExamId == examId && e.GradeId == gradeId && e.SubjectId == subjectId);

            return exist;
        }

        public async Task AssignSubjectsForExam(ExamGradeSubject examGradeSubject)
        {
            _context.ExamGradeSubjects.Add(examGradeSubject);
            await _context.SaveChangesAsync();

        }

        public async Task<ExamDetailsResDto?> ExamDetails(int id)
        {
            var exam = await _context.Exams.Where(e => e.Id == id).Include(e => e.ExamGrades).ThenInclude(g => g.Grade).ThenInclude(g=>g.Classes).Include(e => e.ExamGradeSubjects).ThenInclude(eg=>eg.Subject).FirstOrDefaultAsync();

            var map = _mapper.Map<ExamDetailsResDto>(exam);

            

            return map;
        }



    }
}
