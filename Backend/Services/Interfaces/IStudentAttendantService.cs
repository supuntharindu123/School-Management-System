using Backend.DTOs;
using Backend.Helper;
using Backend.Models;

namespace Backend.Services.Interfaces
{
    public interface IStudentAttendantService
    {
        public Task<Result> Attendances(List<StudentAttendances> studentAttendances);

        public Task<Result<List<StudentAttendanceResDto>>> AttendanceByStudent(int studentId);

        public Task<Result> Remove(int id);

        public Task<Result<List<StudentAttendanceResDto>>> ClassAttendant(int classId, DateOnly date);

        public Task<Result<StudentAttendanceResDto?>> AttendantById(int id);

        public Task<Result<List<StudentAttendanceResDto>>> AttendantByDate(DateOnly date);

        public Task<Result> UpdateAttendant(int id,StudentAttendances studentAttendances);

        public Task<Result<List<StudentAttendanceResDto>>> AllAttendances();
    }
}
