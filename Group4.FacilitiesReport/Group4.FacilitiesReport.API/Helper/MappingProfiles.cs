using AutoMapper;
using Group4.FacilitiesReport.DTO;
using Group4.FacilitiesReport.DTO.Models;

namespace Group4.FacilitiesReport.API.Helper
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<User, TblUser>().ReverseMap();
            CreateMap<Feedback, TblFeedback>().ReverseMap();
        }
    }
}
