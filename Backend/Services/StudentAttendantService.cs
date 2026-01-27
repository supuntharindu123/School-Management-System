using AutoMapper;
using Backend.DTOs;
using Backend.Helper;
using Backend.Models;
using Backend.Repositories.Interfaces;
using Backend.Services.Interfaces;
using System.Transactions;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Backend.Services
{
    public class StudentAttendantService:IStudentAttendantService
    {
        private readonly IStudentAttendantRepo _repo;
        private readonly IMapper _mapper;

        public StudentAttendantService(IStudentAttendantRepo repo,IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        public async Task<Result<List<StudentAttendanceResDto>>> AttendanceByStudent(int studentId)
        {
            var attendance=await _repo.AttendanceByStudent(studentId);

            if(attendance == null)
            {
                return Result<List<StudentAttendanceResDto>>.Failure("No attendance records found for this student");
            }

            var map = _mapper.Map<List<StudentAttendanceResDto>>(attendance);

            return Result<List<StudentAttendanceResDto>>.Success(map);
        }

        public async Task<Result> Attendances(List<StudentAttendances> studentAttendances)
        {
            using var Transaction = await _repo.BeginTransactionAsync();

            try
            {
                foreach (var attendance in studentAttendances)
                {
                    var existing = await _repo.GetByStudentAndDate(
                    attendance.StudentId,
                    attendance.Date
                );

                    if (existing != null)
                    {
                        return Result.Failure($"Attendance already marked for student ID {attendance.StudentId} on {attendance.Date}");
                    }

                    await _repo.Attendances(attendance);
                }
                await Transaction.CommitAsync();
                return Result.Success();
            }
            catch
            {
                await Transaction.RollbackAsync();
                return Result.Failure("Failed to mark attendance. No records were saved.");
            }
           
        }

        public async Task<Result<List<StudentAttendanceResDto>>> AttendantByDate(DateOnly date)
        {
            var attendance = await _repo.AttendantByDate(date);

            if (attendance == null)
            {
                return Result<List<StudentAttendanceResDto>>.Failure("No attendance records found for the selected date");
            }

            var map = _mapper.Map<List<StudentAttendanceResDto>>(attendance);

            return Result<List<StudentAttendanceResDto>>.Success(map);
        }

        public async Task<Result<StudentAttendanceResDto?>> AttendantById(int id)
        {
            var attendance = await _repo.AttendantById(id);

            if (attendance == null)
            {
                return Result<StudentAttendanceResDto?>.Failure("Attendance record not found");
            }

            var map = _mapper.Map<StudentAttendanceResDto>(attendance);

            return Result<StudentAttendanceResDto?>.Success(map);
        }

        public async Task<Result<List<StudentAttendanceResDto>>> ClassAttendant(int classId, DateOnly date)
        {
            var attendance = await _repo.ClassAttendant(classId,date);

            if (attendance == null)
            {
                return Result<List<StudentAttendanceResDto>>.Failure("No attendance records found for this class on the selected date");
            }

            var map = _mapper.Map<List<StudentAttendanceResDto>>(attendance);

            return Result<List<StudentAttendanceResDto>>.Success(map);
        }

        public async Task<Result> Remove(int id)
        {
            var attendant = await _repo.AttendantById(id);
            if (attendant == null)
            {
                return Result.Failure("Attendance record does not exist or has already been removed");
            }

            await _repo.Remove(attendant);

            return Result.Success();
        }

        public async Task<Result> UpdateAttendant(int id,StudentAttendances studentAttendances)
        {

            var attendant = await _repo.AttendantById(id);

            if (attendant == null)
            {
                return Result.Failure("Attendant Record Not Found");
            }

            if(attendant.Date != studentAttendances.Date)
            {
                return Result.Failure("Attendance can only be updated on the same day it was marked");
            }

            _mapper.Map(studentAttendances, attendant);

            await _repo.UpdateAttendant(attendant);

            return Result.Success();

        }

        public async Task<Result<List<StudentAttendanceResDto>>> AllAttendances()
        {
            var attendance = await _repo.AllAttendance();

            if (attendance == null)
            {
                return Result<List<StudentAttendanceResDto>>.Failure("No attendance records found ");
            }

            var map = _mapper.Map<List<StudentAttendanceResDto>>(attendance);

            return Result<List<StudentAttendanceResDto>>.Success(map);
        }
    }
}
