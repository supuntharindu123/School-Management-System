using Backend.DTOs.Marks;
using Backend.Helper;
using Backend.Models;

namespace Backend.Services.Interfaces
{
    public interface IMarksService
    {
        public Task<Result> AddMarks(List<Marks> marks);

        public Task<Result<List<MarkResDto>>> GetMarksByGrade(int examId, int gradeId);

        public Task<Result<List<MarkResDto>>> GetMarksByClass( int classId);

        public Task<Result<List<MarkResDto>>> GetMarksForStudent(int studentId);

        public Task<Result<List<MarkResDto>>> GetMarksByClassAndSubject(int classId, int subjectId);
    }
}
