using AutoMapper;
using Group4.FacilitiesReport.DTO;
using Group4.FacilitiesReport.DTO.Models;

namespace Group4.FacilitiesReport.API.Helper
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<User, TblUser>().ReverseMap().ForMember(item => item.Status, otp => otp.MapFrom(item => ((DTO.Enums.UserStatus)item.Status).ToString()));
            CreateMap<Feedback, TblFeedback>().ReverseMap().ForMember(item => item.Status, otp => otp.MapFrom(item => ((DTO.Enums.FeedbackStatus)item.Status).ToString()));
            CreateMap<TblUserRole, UserRole>().ReverseMap();
            CreateMap<TblCategoriesProblem, Category>().ReverseMap();
            CreateMap<DTO.Task, TblTask>().ReverseMap().ForMember(item => item.Status, otp => otp.MapFrom(item => ((DTO.Enums.TaskStatus)item.Status).ToString()));
            CreateMap<TblLocation, Location>().ReverseMap().ForMember(item => item.Disable, otp => otp.MapFrom(item => ((DTO.Enums.LocationStatus)item.Disable).ToString()));

        }
    }
}
