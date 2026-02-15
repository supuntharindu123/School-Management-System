using AutoMapper;
using Backend.DTOs.Attendances;
using Backend.DTOs.Exam;
using Backend.DTOs.Grade;
using Backend.DTOs.Marks;
using Backend.DTOs.Promotion;
using Backend.DTOs.Student;
using Backend.DTOs.Subject;
using Backend.DTOs.Teacher;
using Backend.DTOs.User;
using Backend.Models;
using System.Runtime;

namespace Backend.Mapping
{
    public class UserMapper:Profile
    {
        public UserMapper() {
            CreateMap<RegisterDto, User>()
                .ForMember(destination => destination.Password, option => option.Ignore())
                .ForMember(destination => destination.CreateAt, option => option.MapFrom(src => DateTime.UtcNow));

            CreateMap<TeacherCreateDto, RegisterDto>()
                .ForMember(destination => destination.Role, option => option.MapFrom(src => UserRole.Teacher));

            CreateMap<TeacherCreateDto, Teacher>()
                .ForMember(destination => destination.UserId, option => option.Ignore());

            CreateMap<StudentCreateDto, RegisterDto>()
                .ForMember(destination => destination.Role, option => option.MapFrom(src => UserRole.Student));

            CreateMap<StudentCreateDto, Student>()
                .ForMember(destination => destination.UserId, option => option.Ignore());

            CreateMap<Student, StudentRes>()
                .ForMember(destination => destination.Username, option => option.MapFrom(src => src.User!.Username))
                .ForMember(destination => destination.Email, option => option.MapFrom(src => src.User!.Email))
                .ForMember(destination => destination.PhoneNumber, option => option.MapFrom(src => src.User!.PhoneNumber))
                .ForMember(destination => destination.Role, option => option.MapFrom(src => src.User!.Role))
                .ForMember(destination => destination.CurrentClass, option => option.MapFrom(src => src.Class!.Name))
                .ForMember(destination => destination.ClassId, option => option.MapFrom(src => src.ClassId))
                .ForMember(destination => destination.CurrentGrade, option => option.MapFrom(src => src.Class!.Grade!.GradeName))
                .ForMember(destination => destination.AcademicYearId, option => option.MapFrom(src => src.AcademicYearId));


            CreateMap<StudentUpdateDto, Student>();

            CreateMap<User, UserDto>();

            CreateMap<Teacher, TeacherResponseDto>()
                .ForMember(dest => dest.ClassAssignments,
                    opt => opt.MapFrom(src => src.AssignTasks))
                .ForMember(dest => dest.SubjectClasses,
                    opt => opt.MapFrom(src => src.TeacherSubjectClass));

            CreateMap<TeacherClassAssign, TeacherClassAssignResDto>()
                .ForMember(dest => dest.ClassName,
                    opt => opt.MapFrom(src => src.Class!.Name));

            CreateMap<TeacherSubjectClass, TeacherSubjectClassResDto>()
                .ForMember(dest => dest.ClassName,
                    opt => opt.MapFrom(src => src.Class!.Name))
                .ForMember(dest => dest.SubjectName,
                    opt => opt.MapFrom(src => src.Subject!.SubjectName))
                .ForMember(dest => dest.GradeId,
                    opt => opt.MapFrom(src => src.Class!.GradeId));

            CreateMap<TeacherUpdateDto, Teacher>();

            CreateMap<PromotionDto, StudentAcademicHistory>()
               .ForMember(destination => destination.StartDate, option => option.MapFrom(src => DateTime.UtcNow))
               .ForMember(destination => destination.EndDate, option => option.Ignore())
               .ForMember(destination => destination.Class, option => option.Ignore())
               .ForMember(destination => destination.Student, option => option.Ignore());
 
            CreateMap<PromotionDto, Student>()
               .ForAllMembers(opt => opt.Ignore());
               
            CreateMap<StudentCreateDto, StudentAcademicHistory>()
               //.ForMember(destination => destination.ClassId, opt => opt.MapFrom(src => src.CurrentClassID))
               .ForMember(destination => destination.StartDate, opt => opt.MapFrom(src => DateTime.UtcNow))
               .ForMember(destination => destination.Status, opt => opt.MapFrom(src => "Promoted")) 
               .ForMember(destination => destination.StudentId, opt => opt.Ignore())
               .ForMember(destination => destination.Student, opt => opt.Ignore());

            CreateMap<TeacherClassAssignDto, TeacherClassAssign>();

            CreateMap<TeacherClassAssign, TeacherClassRes>()
                .ForMember(destination => destination.TeacherName, opt => opt.MapFrom(src => src.Teacher!.FullName));
                

            CreateMap<AssignTeacherSubjectDto, TeacherSubjectClass>();

            CreateMap<TeacherSubjectClass, AssignTeacherSubjectResDto>()
                .ForMember(destination => destination.TeacherName, opt => opt.MapFrom(src => src.Teacher!.FullName))
                .ForMember(destination => destination.SubjectName, opt => opt.MapFrom(src => src.Subject!.SubjectName))
                .ForMember(destination => destination.ClassName, opt => opt.MapFrom(src => src.Class!.Name))
                .ForMember(destination => destination.ClassId, opt => opt.MapFrom(src => src.ClassId))
                .ForMember(destination => destination.subjectId, opt => opt.MapFrom(src => src.SubjectId));


            CreateMap<StudentAttendances, StudentAttendanceResDto>()
                .ForMember(destination => destination.TeacherName, opt => opt.MapFrom(src => src.Teacher!.FullName))
                .ForMember(destination => destination.StudentName, opt => opt.MapFrom(src => src.Student!.FullName))
                .ForMember(destination => destination.ClassName, opt => opt.MapFrom(src => src.Student!.Class!.Name));

            CreateMap<StudentAttendanceUpdateDto, StudentAttendances>();

            CreateMap<Exam, ExamResDto>()
                .ForMember(d => d.AcademicYear,
                    o => o.MapFrom(s => s.AcademicYear!.Year))
                .ForMember(d => d.ExamGrades,
                    o => o.MapFrom(s =>
                        s.ExamGradeSubjects!
                            .GroupBy(x => x.GradeId)
                            .Select(g => new ExamSubjectDto
                            {
                                GradeId = g.Key,
                                SubjectId = g.Select(x => x.SubjectId).ToList()
                            })));


            CreateMap<ExamUpdateDto, Exam>();

            CreateMap<Student, StudentBasicDto>();

            CreateMap<TeacherClassAssign, ClassTeacherDto>()
                .ForMember(des => des.TeacherName,
                    opt => opt.MapFrom(src => src.Teacher!.FullName))
                .ForMember(des=>des.CreatedDate,opt=>opt.MapFrom(src=>src.CreatedDate.ToString("yyyy-MM-dd")))
                 .ForMember(des => des.UpdatedDate,
                    opt => opt.MapFrom(src => src.UpdatedDate.ToString("yyyy-MM-dd")));

            CreateMap<TeacherSubjectClass, ClassSubjectTeacherDto>()
                .ForMember(des => des.SubjectName,
                    opt => opt.MapFrom(src => src.Subject!.SubjectName))
                .ForMember(des => des.TeacherName,
                    opt => opt.MapFrom(src => src.Teacher!.FullName))
                .ForMember(des => des.CreatedDate,
                    opt => opt.MapFrom(src => src.StartDate.ToString("yyyy-MM-dd")))
                .ForMember(des => des.UpdatedDate,
                    opt => opt.MapFrom(src => src.EndDate.ToString("yyyy-MM-dd")));

            CreateMap<Class, ClassDetailsResDto>()
                .ForMember(des => des.ClassId, opt => opt.MapFrom(src => src.Id))
                .ForMember(des => des.ClassName, opt => opt.MapFrom(src => src.Name))
                .ForMember(des => des.ClassTeachers, opt => opt.MapFrom(src => src.TeacherClassAssign))
                .ForMember(des => des.SubjectTeachers, opt => opt.MapFrom(src => src.TeacherSubjectClass));

            CreateMap<Grade, GradeResDto>();

            CreateMap<Subject, SubjectGradeResDto>()
                .ForMember(des => des.Grades, opt => opt.MapFrom(src => src.SubjectGrade!.Select(s => s.Grade)));

            CreateMap<SubjectGradeCreateDto, SubjectGrade>();

            CreateMap<Exam, ExamDetailsResDto>()
                .ForMember(des => des.Grades, opt => opt.MapFrom(src => src.ExamGrades))
                .ForMember(des => des.AcademicYear, opt => opt.MapFrom(src => src.AcademicYear!.Year))
                .ForMember(des => des.ExamType, opt => opt.MapFrom(src => src.ExamType))
                .ForMember(des => des.TotalGrades, opt => opt.MapFrom(src => src.ExamGrades!.Select(e=>e.ExamId).Count()))
                .ForMember(d => d.examDurationDays, opt => opt.MapFrom(s =>s.EndDate.DayNumber - s.StartDate.DayNumber))
                .ForMember(d => d.TotalSubjects,opt => opt.MapFrom(s => s.ExamGradeSubjects!.Select(x => x.SubjectId).Distinct().Count()));

            CreateMap<ExamGrade, GradeExamResDto>()
                .ForMember(des => des.Classes, opt => opt.MapFrom(src => src.Grade!.Classes))
                .ForMember(des => des.Subjects, opt => opt.MapFrom(src => src.Exam!.ExamGradeSubjects!.Where(s=>s.GradeId==src.GradeId)));

            CreateMap<ExamGradeSubject, SubjectResDto>()
                .ForMember(des => des.Id, opt => opt.MapFrom(src => src.SubjectId))
                .ForMember(des => des.SubjectName, opt => opt.MapFrom(src => src.Subject!.SubjectName))
                .ForMember(des => des.ModuleCode, opt => opt.MapFrom(src => src.Subject!.ModuleCode));

            CreateMap<Marks, MarkResDto>()
                .ForMember(des => des.AcademicYearId, opt => opt.MapFrom(src => src.Exam!.AcademicYearId))
                .ForMember(des => des.StudentIDNumber, opt => opt.MapFrom(src => src.Student!.StudentIDNumber))
                .ForMember(des => des.StudentName, opt => opt.MapFrom(src => src.Student!.FullName));



        }
    }
}
