using AutoMapper;
using Backend.Data;
using Backend.DTOs;
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

        public PromotionService(AppDbContext context,IMapper mapper, IStudentHistoryRepo historyrepo, IStudentRepo studentrepo)
        {
            _context = context;
            _mapper = mapper;
            _historyRepo = historyrepo;
            _studentRepo = studentrepo;
        }
        public async Task PromotionStudents(PromotionList dto)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                foreach(var promo in dto.Promotions)
                {
                    var student = await _studentRepo.GetStudentById(promo.StudentId);

                    if (student == null)
                    {
                        throw new Exception("Student Not Found");
                    }

                    var studenthistory = await _historyRepo.GetById(promo.StudentId, promo.OldYearId);

                    if( studenthistory == null)
                    {
                        throw new Exception("Student History Not Found");
                    }

                    studenthistory.EndDate = DateTime.UtcNow;
                    studenthistory.Status = promo.Status;

                    if(promo.Status== "Promoted" || promo.Status == "Repeat")
                    {
                        var newstudenthistory = _mapper.Map<StudentAcademicHistory>(promo);
                        //newstudenthistory.student=student;

                        await _historyRepo.AddStudentHistory(newstudenthistory);

                        student.CurrentGradeID = promo.GradeId;
                        student.CurrentYearID = promo.YearId;
                        student.CurrentClassID = promo.ClassId;
                        
                    }
                    else
                    {
                        student.Status = promo.Status;
                        student.CurrentGradeID = null;
                        student.CurrentYearID = null;
                        student.CurrentClassID = null;
                        
                    }
                    await _studentRepo.UpdateStudent(student);
                    await _historyRepo.UpdateStudentHistory(studenthistory);

                }
                await transaction.CommitAsync();
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }

        }
    }
}
