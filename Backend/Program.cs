using Backend.Authorization.Handlers;
using Backend.Authorization.Requirements;
using Backend.Data;
using Backend.Helper;
using Backend.Repositories;
using Backend.Repositories.Interfaces;
using Backend.Services;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using OfficeOpenXml;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

ExcelPackage.License.SetNonCommercialPersonal("StudentSystem");

var builder = WebApplication.CreateBuilder(args);



// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi

//database
builder.Services.AddDbContext<AppDbContext>(option => option.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

//mapper
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

//dependency injections
builder.Services.AddScoped<IUserRepo, UserRepo>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<TokenGenerator>();
builder.Services.AddScoped<Passwordhash>();
builder.Services.AddScoped<ITeacherRepo,TeacherRepo>();
builder.Services.AddScoped<ITeacherService,TeacherService>();
builder.Services.AddScoped<IStudentRepo, StudentRepo>();
builder.Services.AddScoped<IStudentService,StudentService>();
builder.Services.AddScoped<IStudentHistoryRepo, StudentHistoryRepo>();
builder.Services.AddScoped<IPromotionServices, PromotionService>();
builder.Services.AddScoped<IGradeRepo, GradeRepo>();
builder.Services.AddScoped<IGradeService, GradeService>();
builder.Services.AddScoped<IYearRepo, YearRepo>();
builder.Services.AddScoped<IYearService, YearService>();
builder.Services.AddScoped<IClassRepo, ClassRepo>();
builder.Services.AddScoped<IClassService, ClassService>();
builder.Services.AddScoped<ITeacherAssignmentRepo,TeacherAssignmentRepo>();
builder.Services.AddScoped<ITeacherAssignmentService,TeacherAssignmentService>();
builder.Services.AddScoped<ISubjectRepo,SubjectRepo>();
builder.Services.AddScoped<ISubjectService, SubjectService>();
builder.Services.AddScoped<ISubjectGradeRepo,SubjectGradeRepo>();
builder.Services.AddScoped<ISubjectGradeService, SubjectGradeService>();
builder.Services.AddScoped<ITeacherAssignSubjectRepo,TeacherAssignSubjectRepo>();
builder.Services.AddScoped<ITeacherAssignSubjectService, TeacherAssignSubjectService>();
builder.Services.AddScoped<IStudentAttendantRepo,StudentAttendantRepo > ();
builder.Services.AddScoped<IStudentAttendantService,StudentAttendantService>();
builder.Services.AddScoped<IExamRepo,ExamRepo>();
builder.Services.AddScoped<IExamServices,ExamServices>();
builder.Services.AddScoped<IMarksRepo,MarksRepo>();
builder.Services.AddScoped<IMarksService,MarksService>();


//handler
builder.Services.AddScoped<IAuthorizationHandler, StudentOwnDataHandler>();
builder.Services.AddScoped<IAuthorizationHandler, AssignSubjectsOnlyHandler>();
builder.Services.AddScoped<IAuthorizationHandler, AssignClassesOnlyHandler>();
builder.Services.AddScoped<IAuthorizationHandler, TeacherOwnDataHandler>();

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("StudentOwnDataPolicy",
        policy => policy.Requirements.Add(new StudentOwnDataRequirements()));
});

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("TeacherOwnDataPolicy",
        policy => policy.Requirements.Add(new TeacherOwnDataRequirements()));
});

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AssignSubjectsOnly",
        policy => policy.Requirements.Add(new AssignSubjectsOnlyRequirements()));
});

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AssignClassesOnly",
        policy => policy.Requirements.Add(new AssignClassesOnlyRequirements()));
});


//authentications
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
        };
    });

JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy
                .WithOrigins("http://localhost:5173")
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});




builder.Services.AddSwaggerGen();

builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    
}

//app.UseHttpsRedirection();
app.UseCors("AllowReactApp");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
