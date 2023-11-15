using AutoMapper;
using Group4.FacilitiesReport.DTO;
using Group4.FacilitiesReport.DTO.Models;

namespace Group4.FacilitiesReport.API.Helper
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<User, TblUser>().ForMember(item => item.Status, otp => otp.MapFrom(item => (int)Enum.Parse(typeof(DTO.Enums.UserStatus), item.Status))).ReverseMap().ForMember(item => item.Status, otp => otp.MapFrom(item => ((DTO.Enums.UserStatus)item.Status).ToString()));

            CreateMap<TblFeedback, Feedback>()
            .ForMember(item => item.Status, otp => otp.MapFrom(item => ((DTO.Enums.FeedbackStatus)item.Status).ToString()))
            .ReverseMap()
            .ForMember(item => item.Status, otp => otp.MapFrom(item => (int)Enum.Parse(typeof(DTO.Enums.FeedbackStatus), item.Status)));
            CreateMap<EmployeeObject, TblUser>().ReverseMap().ForMember(item => item.CountTask, otp => otp.MapFrom(item => item.TblTaskEmployees.Count));
            CreateMap<TblUserRole, UserRole>().ReverseMap();
            CreateMap<TblCategoriesProblem, Category>().ReverseMap();
            CreateMap<DTO.Task, TblTask>().ForMember(item => item.Status, otp => otp.MapFrom(item => (int)Enum.Parse(typeof(DTO.Enums.TaskStatus), item.Status))).ReverseMap().ForMember(item => item.Status, otp => otp.MapFrom(item => ((DTO.Enums.TaskStatus)item.Status).ToString()));
            CreateMap<Location, TblLocation>().ForMember(item => item.Disable, otp => otp.MapFrom(item => (int)Enum.Parse(typeof(DTO.Enums.LocationStatus), item.Disable))).ReverseMap().ForMember(item => item.Disable, otp => otp.MapFrom(item => ((DTO.Enums.LocationStatus)item.Disable).ToString()));
            CreateMap<TblConfig, ConfigDTO>().ReverseMap();
        }
    }
}
