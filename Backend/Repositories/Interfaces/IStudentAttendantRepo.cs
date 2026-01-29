using Backend.Models;
using Microsoft.EntityFrameworkCore.Storage;

namespace Backend.Repositories.Interfaces
{
    public interface IStudentAttendantRepo
    {
        public Task Attendances(StudentAttendances studentAttendances);

        public Task<List<StudentAttendances>> AttendanceByStudent(int studentId);

        public Task Remove(StudentAttendances studentAttendances);

        public Task<List<StudentAttendances>> ClassAttendant(int classId, DateOnly date);

        public Task<StudentAttendances?> AttendantById(int id);

        public Task<List<StudentAttendances>> AttendantByDate(DateOnly date);

        public Task UpdateAttendant();

        public Task<StudentAttendances?> GetByStudentAndDate(int studentId, DateOnly date);

        public Task<IDbContextTransaction> BeginTransactionAsync();

        public Task<List<StudentAttendances>> AllAttendance();
    }
}
