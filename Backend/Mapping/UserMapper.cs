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
                .ForMember(destination => destination.CurrentClass, option => option.MapFrom(src => src.Class!.Name));

            CreateMap<StudentUpdateDto, Student>();

            CreateMap<Teacher, TeacherRes>()
                .ForMember(destination => destination.Username, option => option.MapFrom(src => src.User!.Username))
                .ForMember(destination => destination.Email, option => option.MapFrom(src => src.User!.Email))
                .ForMember(destination => destination.PhoneNumber, option => option.MapFrom(src => src.User!.PhoneNumber))
                .ForMember(destination => destination.Role, option => option.MapFrom(src => src.User!.Role));

            CreateMap<TeacherUpdateDto, Teacher>();

            CreateMap<PromotionDto, StudentAcademicHistory>()
               .ForMember(destination => destination.StartDate, option => option.MapFrom(src => DateTime.UtcNow))
               .ForMember(destination => destination.EndDate, option => option.Ignore())
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
                .ForMember(destination => destination.TeacherName, opt => opt.MapFrom(src => src.Teacher!.FullName))
                .ForMember(destination => destination.TeacherName, opt => opt.MapFrom(src => src.Class!.Name));
        }
    }
}
