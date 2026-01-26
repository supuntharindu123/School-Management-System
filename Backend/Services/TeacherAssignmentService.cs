using AutoMapper;
using Backend.DTOs;
using Backend.Helper;
using Backend.Models;
using Backend.Repositories.Interfaces;
using Backend.Services.Interfaces;

namespace Backend.Services
{
    public class TeacherAssignmentService : ITeacherAssignmentService
    {
        private readonly ITeacherAssignmentRepo _repo;
        private readonly IClassRepo _classRepo;
        private readonly IMapper _mapper;

        public TeacherAssignmentService(ITeacherAssignmentRepo repo, IMapper mapper,IClassRepo classRepo)
        {
            _repo = repo;
            _mapper = mapper;
            _classRepo = classRepo;
        }

        public async Task<Result<TeacherClassRes>> AssignmentById(int id)
        {

            var res = await _repo.AssignmentById(id);
            
            if (res == null) {
                return Result<TeacherClassRes>.Failure("Teacher assigned class not found");
            }

            var classRes = _mapper.Map<TeacherClassRes>(res);

            return Result<TeacherClassRes>.Success(classRes);
        }

        public async Task<Result> CreateAssignmentTask(TeacherClassAssignDto task)
        {
            var tasks = await _repo.AssignmentById(task.TeacherId);
            if (tasks != null) {
                tasks.IsActive = false;
                tasks.UpdatedDate= DateTime.Now;
            }

            var classID = await _classRepo.GetClassByIDs(task.GradeId, task.ClassNameId);

            var newTask = _mapper.Map<TeacherClassAssign>(task);
            newTask.ClassId = classID!.Id;
            newTask.IsActive = true;
            newTask.CreatedDate = DateTime.Now;
            newTask.UpdatedDate = null;
            await _repo.CreateAssignment(newTask);

            return Result.Success();      
        }

        public async Task<Result<IEnumerable<TeacherClassRes>>> AssignmentBYTeacher(int id)
        {
            var res = await _repo.GetAssignmentFromTeacher(id);
            if (res == null)
            {
                return Result<IEnumerable<TeacherClassRes>>.Failure("Teacher assigned class not found");
            }
            var classRes= _mapper.Map<List<TeacherClassRes>>(res);
            return Result<IEnumerable<TeacherClassRes>>.Success(classRes);
        }

        public async Task<Result<TeacherClassRes?>> AssignmentByClass(int ClassId)
        {
            var res = await _repo.AssignmentByClass(ClassId);
            if (res == null)
            {
                return Result<TeacherClassRes?>.Failure("Teacher assigned class not found");
            }
            var classRes = _mapper.Map<TeacherClassRes>(res);
            return Result<TeacherClassRes?>.Success(classRes);
            
        }
    }

}
