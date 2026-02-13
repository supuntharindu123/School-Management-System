using Backend.Data;
using Backend.Models;
using Backend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class StudentRepo : IStudentRepo
    {
        private readonly AppDbContext _context;

        public StudentRepo(AppDbContext context)
        {
            _context = context;
        }

        public async Task AddStudent(Student student)
        {
            student.StudentIDNumber = await generateID();
            await _context.Students.AddAsync(student);
            await _context.SaveChangesAsync();
        }

        public async Task<List<Student>> GetAllStudents()
        {
            return await _context.Students.Include(s=>s.User).Include(s=>s.AcademicYear).Include(s => s.Class).ThenInclude(s=>s.Grade).ToListAsync();
        }


        public async Task<Student?> GetStudentById(int id)
        {
            return await _context.Students
                .Include(s=>s.User).Include(c=>c.Class).ThenInclude(s => s.Grade).Include(s => s.AcademicYear)
                .FirstOrDefaultAsync(s => s.Id == id);
        }

        public async Task UpdateStudent()
        {
            await _context.SaveChangesAsync();
        }

        public async Task DeleteStudent(Student student) {
            _context.Students.Remove(student);
            await _context.SaveChangesAsync();
        }

        public async Task<string> generateID()
        {
            var lastStd = await _context.Students.OrderByDescending(s => s.Id).FirstOrDefaultAsync();
            int nextId = 1;
            if(lastStd != null)
            {
                var lastNum = int.Parse(
                    lastStd.StudentIDNumber.Replace("STD", "")
                    );
                nextId = lastNum + 1;
            }


            return $"STD{nextId:D6}";
        }

        public async Task<List<Student>> GetStudentsByClass(int classId)
        {
            return await _context.Students.Where(s=>s.ClassId==classId && s.Status=="Active").ToListAsync();
        }

    }
}
