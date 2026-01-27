using Backend.DTOs;
using Backend.Helper;
using Backend.Models;

namespace Backend.Services.Interfaces
{
    public interface IClassService
    {
        public Task<Result> CreateClass(Class clz);
        public Task<Result<ClassDetailsResDto>> GetClassById(int id);
        public Task<Result<List<Class>>> GetClassByGrade(int GradeId);

        public Task<Result> RemoveClass(int id);

        public Task<Result<List<ClassDetailsResDto>>> GetClasses();

    }
}
