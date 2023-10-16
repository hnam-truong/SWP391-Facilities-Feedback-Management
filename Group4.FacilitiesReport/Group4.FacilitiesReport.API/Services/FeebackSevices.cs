using AutoMapper;
using Group4.FacilitiesReport.API.Helper;
using Group4.FacilitiesReport.DTO;
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
        public async Task<APIResponse> GetAllFeedback()
        {
            APIResponse response = new APIResponse();
            try
            {
                var feedbacks = _mapper.Map<List<Feedback>>(_iFeedback.GetAllFeedBack());
                if (feedbacks != null)
                {
                    response.ResponseCode = 400;
                    Re
                }
            }
            catch (Exception ex)
            {
                response.ResponseCode = 404;
                response.ErrorMessage = ex.Message;
            }

            return response;
        }
    }
}
