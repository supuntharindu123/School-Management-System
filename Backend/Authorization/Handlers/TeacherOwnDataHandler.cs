using Backend.Authorization.Requirements;
using Microsoft.AspNetCore.Authorization;

namespace Backend.Authorization.Handlers
{
    public class TeacherOwnDataHandler:AuthorizationHandler<TeacherOwnDataRequirements,int>
    {
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, TeacherOwnDataRequirements requirement, int teacherId)
        {
            var teacherIdClaim = context.User.FindFirst("teacherId");

            if (teacherIdClaim == null)
            {
                return Task.CompletedTask;
            }

            var loggedTeacherId = int.Parse(teacherIdClaim.Value);

            if (loggedTeacherId == teacherId)
            {
                context.Succeed(requirement);
            }

            return Task.CompletedTask;
        }
    }

}
