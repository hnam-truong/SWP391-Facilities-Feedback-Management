using AutoMapper;
using Group4.FacilitiesReport.DTO.Models;
using Group4.FacilitiesReport.Interface;

namespace Group4.FacilitiesReport.API.Services
{
    public class FeebackSevices
    {
        private readonly IFeedback _iFeedback;
        private readonly IMapper _mapper;
        private readonly IWebHostEnvironment environment;
        private readonly FacilitiesFeedbackManagement_SWP391Context context;

        public FeebackSevices(IFeedback iFeedback, IMapper mapper, IWebHostEnvironment environment, FacilitiesFeedbackManagement_SWP391Context context)
        {
            _iFeedback = iFeedback;
            _mapper = mapper;
            this.environment = environment;
            this.context = context;
        }

    }
}
