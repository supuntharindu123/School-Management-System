using Backend.Authorization.Requirements;
using Backend.Data;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace Backend.Authorization.Handlers
{
    public class StudentOwnDataHandler : AuthorizationHandler<StudentOwnDataRequirements, int>
    {
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, StudentOwnDataRequirements requirement, int studentId)
        {
            var studentIdClaim = context.User.FindFirst("studentId");

            if (studentIdClaim == null)
            {
                return Task.CompletedTask;
            }

            var loggedStudentId=int.Parse(studentIdClaim.Value);

            if (loggedStudentId == studentId)
            {
                context.Succeed(requirement);
            }

            return Task.CompletedTask;
        }
    }
}
