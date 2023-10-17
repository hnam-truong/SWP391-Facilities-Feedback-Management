using AutoMapper;
using Group4.FacilitiesReport.Interface;

namespace Group4.FacilitiesReport.API.Services
{
    public class FeebackSevices
    {
        private readonly IFeedback _iFeedback;
        private readonly IMapper _mapper;
        private readonly IWebHostEnvironment environment;

        public FeebackSevices(IFeedback iFeedback, IMapper mapper, IWebHostEnvironment environment)
        {
            _iFeedback = iFeedback;
            _mapper = mapper;
            this.environment = environment;
        }

    }
}
