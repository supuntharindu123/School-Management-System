using Backend.Data;
using Backend.Models;
using Backend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;

namespace Backend.Repositories
{
    public class StudentAttendantRepo:IStudentAttendantRepo
    {
        private readonly AppDbContext _context;

        public StudentAttendantRepo(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<StudentAttendances>> AttendanceByStudent(int studentId)
        {
            return await _context.StudentAttendances.Where(s => s.StudentId == studentId).Include(s => s.Teacher).Include(s => s.Student).ThenInclude(s=>s.Class).ToListAsync();
        }

        public async Task Attendances(StudentAttendances studentAttendances)
        {
            _context.StudentAttendances.Add(studentAttendances);
            await _context.SaveChangesAsync();
        }

        public async Task<List<StudentAttendances>> AttendantByDate(DateOnly date)
        {
            return await _context.StudentAttendances.Where(s => s.Date == date).Include(s => s.Teacher).Include(s => s.Student).ThenInclude(s=>s.Class).ToListAsync();
        }

        public async Task<StudentAttendances?> AttendantById(int id)
        {
            return await _context.StudentAttendances.Include(s => s.Teacher).Include(s => s.Student).ThenInclude(s => s.Class).FirstOrDefaultAsync(s=>s.Id==id);
        }

        public async Task<List<StudentAttendances>> ClassAttendant(int classId, DateOnly date)
        {
            return await _context.StudentAttendances.Where(s => s.Student.ClassId == classId && s.Date==date).Include(s => s.Teacher).Include(s => s.Student).ThenInclude(s => s.Class).ToListAsync();
        }

        public async Task Remove(StudentAttendances studentAttendances)
        {
            _context.StudentAttendances.Remove(studentAttendances);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAttendant(StudentAttendances studentAttendances)
        {
            _context.StudentAttendances.Update(studentAttendances);
            await _context.SaveChangesAsync();
        }

        public async Task<StudentAttendances?> GetByStudentAndDate(int studentId, DateOnly date)
        {
            return await _context.StudentAttendances.Include(s => s.Teacher).Include(s => s.Student).ThenInclude(s => s.Class)
                .FirstOrDefaultAsync(a => a.StudentId == studentId && a.Date == date);
        }

        public async Task<IDbContextTransaction> BeginTransactionAsync()
        {
            return await _context.Database.BeginTransactionAsync();
        }
    }
}
