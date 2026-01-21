using AutoMapper;
using Backend.Data;
using Backend.DTOs;
using Backend.Helper;
using Backend.Models;
using Backend.Repositories.Interfaces;
using Backend.Services.Interfaces;

namespace Backend.Services
{
    public class PromotionService : IPromotionServices
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;
        private readonly IStudentHistoryRepo _historyRepo;
        private readonly IStudentRepo _studentRepo;
        private readonly IClassRepo _classRepo;

        public PromotionService(AppDbContext context, IMapper mapper, IStudentHistoryRepo historyrepo, IStudentRepo studentrepo, IClassRepo classRepo)
        {
            _context = context;
            _mapper = mapper;
            _historyRepo = historyrepo;
            _studentRepo = studentrepo;
            _classRepo = classRepo;
        }
        public async Task<Result> PromotionStudents(PromotionList dto)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                foreach (var promo in dto.Promotions)
                {
                    var student = await _studentRepo.GetStudentById(promo.StudentId);

                    if (student == null)
                    {
                        return Result.Failure("Student Not Found");
                    }


                    var studenthistory = await _historyRepo.GetById(promo.StudentId);

                    if (studenthistory == null)
                    {
                        return Result.Failure("Student Not Found");
                    }

                    studenthistory.EndDate = DateTime.UtcNow;
                    studenthistory.Status = promo.Status;

                    if (promo.Status == "Promoted" || promo.Status == "Repeat")
                    {
                        var newHistory = _mapper.Map<StudentAcademicHistory>(promo);

                        var classEntity = await _classRepo.GetClassByIDs(promo.GradeId, promo.ClassNameId);

                        newHistory.ClassId = classEntity.Id;

                        await _historyRepo.AddStudentHistory(newHistory);

                        student.ClassId = classEntity.Id;
                        student.Class = null;
                    }
                    else
                    {
                        student.Status = promo.Status;
                    }

                    await _studentRepo.UpdateStudent(student);
                    await _historyRepo.UpdateStudentHistory(studenthistory);

                    
                }

                await transaction.CommitAsync();
                return Result.Success();
            }
            catch(Exception ex)
            {
                await transaction.RollbackAsync();
                return Result.Failure("An unexpected error occurred while promoting the student"+ex);
            }
        }

    }

}
