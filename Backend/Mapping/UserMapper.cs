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
        
        }
    }
}
