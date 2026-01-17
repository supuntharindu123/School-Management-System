using AutoMapper;
using Backend.DTOs;
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
                .ForMember(destination => destination.Grade, option => option.MapFrom(src => src.Grade!.GradeName))
                .ForMember(destination => destination.AcademicYear, option => option.MapFrom(src => src.AcademicYear!.Year))
                .ForMember(destination => destination.Class, option => option.MapFrom(src => src.Class!.ClassName));

            CreateMap<StudentUpdateDto, Student>();

            CreateMap<Teacher, TeacherRes>()
                .ForMember(destination => destination.Username, option => option.MapFrom(src => src.user!.Username))
                .ForMember(destination => destination.Email, option => option.MapFrom(src => src.user!.Email))
                .ForMember(destination => destination.PhoneNumber, option => option.MapFrom(src => src.user!.PhoneNumber))
                .ForMember(destination => destination.Role, option => option.MapFrom(src => src.user!.Role));

            CreateMap<TeacherUpdateDto, Teacher>();

            CreateMap<PromotionDto, StudentAcademicHistory>()
               .ForMember(destination => destination.StartDate, option => option.MapFrom(src => DateTime.UtcNow))
               .ForMember(destination => destination.EndDate, option => option.Ignore())
               .ForMember(destination => destination.student, option => option.Ignore());


            CreateMap<PromotionDto, Student>()
               .ForMember(destination => destination.CurrentClassID, option => option.MapFrom(src => src.ClassId))
               .ForMember(destination => destination.CurrentYearID, option => option.MapFrom(src => src.YearId))
               .ForMember(destination => destination.CurrentGradeID, option => option.MapFrom(src => src.GradeId))
               .ForMember(destination => destination.Id, opt => opt.Ignore())
               .ForMember(destination => destination.UserId, opt => opt.Ignore())
               .ForMember(destination => destination.StudentIDNumber, opt => opt.Ignore())
               .ForMember(destination => destination.FullName, opt => opt.Ignore())
               .ForMember(destination => destination.BirthDay, opt => opt.Ignore())
               .ForMember(destination => destination.Address, opt => opt.Ignore())
               .ForMember(destination => destination.City, opt => opt.Ignore())
               .ForMember(destination => destination.Gender, opt => opt.Ignore())
               .ForMember(destination => destination.GuardianName, opt => opt.Ignore())
               .ForMember(destination => destination.GuardianRelation, opt => opt.Ignore())
               .ForMember(destination => destination.GuardianDate, opt => opt.Ignore())
               .ForMember(destination => destination.ResignDate, opt => opt.Ignore())
               .ForMember(destination => destination.User, opt => opt.Ignore())
               .ForMember(destination => destination.AcademicHistory, opt => opt.Ignore());
               
            CreateMap<StudentCreateDto, StudentAcademicHistory>()
               .ForMember(destination => destination.GradeId, opt => opt.MapFrom(src => src.CurrentGradeID))
               .ForMember(destination => destination.ClassId, opt => opt.MapFrom(src => src.CurrentClassID))
               .ForMember(destination => destination.YearId, opt => opt.MapFrom(src => src.CurrentYearID))
               .ForMember(destination => destination.StartDate, opt => opt.MapFrom(src => DateTime.UtcNow))
               .ForMember(destination => destination.Status, opt => opt.MapFrom(src => "Promoted")) 
               .ForMember(destination => destination.StudentID, opt => opt.Ignore())
               .ForMember(destination => destination.student, opt => opt.Ignore());
        }
    }
}
