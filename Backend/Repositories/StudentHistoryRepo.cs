using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Backend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class StudentHistoryRepo : IStudentHistoryRepo
    {
        private readonly AppDbContext _context;

        public StudentHistoryRepo(AppDbContext context)
        {
            _context = context;
        }

        public async Task AddStudentHistory(StudentAcademicHistory dto)
        {
            await _context.History0fStudents.AddAsync(dto);
            await _context.SaveChangesAsync();
        }

        public async Task<StudentAcademicHistory?> GetById(int studentid, int yearid)
        {
            return await _context.History0fStudents.FirstOrDefaultAsync(s => s.StudentID == studentid && s.YearId ==yearid && s.EndDate == null);
        }

        public async Task UpdateStudentHistory(StudentAcademicHistory dto) {
             _context.History0fStudents.Update(dto);
            await _context.SaveChangesAsync();
        }
    }
}
