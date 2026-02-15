using Backend.Authorization.Requirements;
using Backend.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace Backend.Authorization.Handlers
{
    public class AssignClassesOnlyHandler : AuthorizationHandler<AssignClassesOnlyRequirements, int>
    {
        private readonly AppDbContext _context;

        public AssignClassesOnlyHandler(AppDbContext context)
        {
            _context = context;
        }

        protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context, AssignClassesOnlyRequirements requirement, int classId)
        {
            var teacherIdClaim = context.User.FindFirst("teacherId");

            if (teacherIdClaim == null)
            {
                return;
            }

            var teacherId = int.Parse(teacherIdClaim.Value);

            var classIdList = await _context.TeacherClassAssign.Where(t => t.TeacherId == teacherId && t.IsActive).Select(t => t.ClassId).ToListAsync();

            var classIdListForSubjectAssign = await _context.TeacherSubjectClasses.Where(t => t.TeacherId == teacherId && t.IsActive).Select(t => t.ClassId).ToListAsync();

            if (classIdList.Contains(classId) || classIdListForSubjectAssign.Contains(classId))
            {
                context.Succeed(requirement);
            }

        }
    }
}
