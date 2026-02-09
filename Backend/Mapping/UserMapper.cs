using AutoMapper;
using Backend.DTOs.Attendances;
using Backend.DTOs.Exam;
using Backend.DTOs.Grade;
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
                    opt => opt.MapFrom(src => src.Subject!.SubjectName));

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
                .ForMember(destination => destination.ClassName, opt => opt.MapFrom(src => src.Class!.Name));


            CreateMap<StudentAttendances, StudentAttendanceResDto>()
                .ForMember(destination => destination.TeacherName, opt => opt.MapFrom(src => src.Teacher!.FullName))
                .ForMember(destination => destination.StudentName, opt => opt.MapFrom(src => src.Student!.FullName))
                .ForMember(destination => destination.ClassName, opt => opt.MapFrom(src => src.Student!.Class!.Name));

            CreateMap<StudentAttendanceUpdateDto, StudentAttendances>();

            CreateMap<Exam, ExamResDto>()
                .ForMember(destination => destination.ExamType, opt => opt.MapFrom(src => src.ExamType))
                .ForMember(destination => destination.AcademicYear, opt => opt.MapFrom(src => src.AcademicYear!.Year));

            CreateMap<ExamUpdateDto, Exam>();

            CreateMap<Student, StudentBasicDto>();

            CreateMap<TeacherClassAssign, ClassTeacherDto>()
                .ForMember(d => d.TeacherName,
                    o => o.MapFrom(src => src.Teacher!.FullName));

            CreateMap<TeacherSubjectClass, ClassSubjectTeacherDto>()
                .ForMember(d => d.SubjectName,
                    o => o.MapFrom(src => src.Subject!.SubjectName))
                .ForMember(d => d.TeacherName,
                    o => o.MapFrom(src => src.Teacher!.FullName));

            CreateMap<Class, ClassDetailsResDto>()
                .ForMember(d => d.ClassId, o => o.MapFrom(src => src.Id))
                .ForMember(d => d.ClassName, o => o.MapFrom(src => src.Name))
                .ForMember(d => d.ClassTeachers, o => o.MapFrom(src => src.TeacherClassAssign))
                .ForMember(d => d.SubjectTeachers, o => o.MapFrom(src => src.TeacherSubjectClass));

            CreateMap<Grade, GradeResDto>();

            CreateMap<Subject, SubjectGradeResDto>()
                .ForMember(d => d.Grades, opt => opt.MapFrom(src => src.SubjectGrade!.Select(s => s.Grade)));

            CreateMap<SubjectGradeCreateDto, SubjectGrade>();

            CreateMap<Exam, ExamDetailsResDto>()
                .ForMember(d => d.Grades, opt => opt.MapFrom(src => src.ExamGrades));

            CreateMap<ExamGrade, GradeExamResDto>()
                .ForMember(des => des.Classes, opt => opt.MapFrom(src => src.Grade!.Classes))
                .ForMember(des => des.Subjects, opt => opt.MapFrom(src => src.Exam!.ExamGradeSubjects));

            CreateMap<ExamGradeSubject, SubjectResDto>()
                .ForMember(d => d.Id, opt => opt.MapFrom(src => src.SubjectId))
                .ForMember(d => d.SubjectName, opt => opt.MapFrom(src => src.Subject!.SubjectName))
                .ForMember(d => d.ModuleCode, opt => opt.MapFrom(src => src.Subject!.ModuleCode));
        }
    }
}
