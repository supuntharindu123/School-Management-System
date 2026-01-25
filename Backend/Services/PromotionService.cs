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
        public async Task<Result> PromotionStudents(List<PromotionDto> dto)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                foreach (var promo in dto)
                {
                    var student = await _studentRepo.GetStudentById(promo.StudentId);
                    if (student == null)
                        return Result.Failure("Student not found");

                    // always get ACTIVE history
                    var activeHistory = await _historyRepo.GetById(promo.StudentId);
                    if (activeHistory == null)
                        return Result.Failure("Active academic history not found");

                    // close current history
                    activeHistory.EndDate = DateTime.UtcNow;
                    activeHistory.Status = promo.Status;
                    await _historyRepo.UpdateStudentHistory(activeHistory);

                    // ================= PROMOTED =================
                    if (promo.Status == "Promoted")
                    {
                        var classEntity = await _classRepo.GetClassById(promo.ClassId);
                        if (classEntity == null)
                            return Result.Failure("Invalid class");

                        var newHistory = _mapper.Map<StudentAcademicHistory>(promo);
                        newHistory.StudentId = student.Id;
                        newHistory.ClassId = classEntity.Id;
                        newHistory.AcademicYearId = promo.AcademicYearId;
                        newHistory.Status = "Promoted";

                        await _historyRepo.AddStudentHistory(newHistory);

                        student.ClassId = classEntity.Id;
                        student.AcademicYearId = promo.AcademicYearId;
                        // ❌ DO NOT touch student.Status
                    }

                    // ================= REPEATED =================
                    else if (promo.Status == "Repeated")
                    {
                        var newHistory = _mapper.Map<StudentAcademicHistory>(promo);
                        newHistory.StudentId = student.Id;
                        newHistory.ClassId = student.ClassId; // same class
                        newHistory.AcademicYearId = promo.AcademicYearId;
                        newHistory.Status = "Repeated";

                        await _historyRepo.AddStudentHistory(newHistory);

                        student.AcademicYearId = promo.AcademicYearId;
                        // ❌ DO NOT touch student.Status
                    }

                    // ================= COMPLETED / LEAVING =================
                    else if (promo.Status == "Completed" || promo.Status == "Leaving")
                    {
                        student.Status = promo.Status;
                        // ❌ no new academic history
                        // ❌ no class/year change
                    }

                    await _studentRepo.UpdateStudent(student);
                }

                await transaction.CommitAsync();
                return Result.Success();
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return Result.Failure("Promotion failed: " + ex.Message);
            }
        }

    }

}
