using Backend.Authorization.Requirements;
using Backend.Data;
using Backend.DTOs.AuthResources;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace Backend.Authorization.Handlers
{
    public class AssignSubjectsOnlyHandler : AuthorizationHandler<AssignSubjectsOnlyRequirements, AssignSubjectResourceDto>
    {
        private readonly AppDbContext _context;

        public AssignSubjectsOnlyHandler(AppDbContext context)
        {
            _context = context;
        }

        protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context, AssignSubjectsOnlyRequirements requirement, AssignSubjectResourceDto resource)
        {
            var teacherIdClaim = context.User.FindFirst("teacherId");

            if (teacherIdClaim == null)
            {
                return;
            }

            var teacherId=int.Parse(teacherIdClaim.Value);

            var assignment = await _context.TeacherSubjectClasses.Where(t => t.TeacherId == teacherId && t.SubjectId==resource.SubjectId && t.ClassId==resource.ClassId && t.IsActive).FirstOrDefaultAsync();


            if (assignment !=null)
            {
                context.Succeed(requirement);
            }

        }
    }
}
