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
            await _context.Students.AddAsync(student);
            await _context.SaveChangesAsync();
        }

        public async Task<List<Student>> GetAllStudents()
        {
            return await _context.Students.Include(s=>s.user).ToListAsync();
        }

        public async Task<Student?> GetStudentById(int id)
        {
            return await _context.Students
                .AsNoTracking()
                .FirstOrDefaultAsync(s => s.Id == id);
        }

        public async Task UpdateStudent(Student student) {
             _context.Students.Update(student);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteStudent(Student student) {
            _context.Students.Remove(student);
            await _context.SaveChangesAsync();
        }
    }
}
