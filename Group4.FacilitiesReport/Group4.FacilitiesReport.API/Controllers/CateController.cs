using AutoMapper;
using Group4.FacilitiesReport.Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Group4.FacilitiesReport.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CateController : ControllerBase
    {
        private readonly ICategory _iCategory;
        private readonly IConfiguration _configuration;
        private readonly IMapper _mapper;

        public CateController(ICategory iCategory, IConfiguration configuration, IMapper mapper)
        {
            _iCategory = iCategory;
            _configuration = configuration;
            _mapper = mapper;
        }


    }
}
