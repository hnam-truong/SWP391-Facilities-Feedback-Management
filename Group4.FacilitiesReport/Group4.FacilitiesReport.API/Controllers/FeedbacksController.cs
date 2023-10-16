using AutoMapper;
using Group4.FacilitiesReport.DTO;
using Group4.FacilitiesReport.DTO.Models;
using Group4.FacilitiesReport.Interface;
using Microsoft.AspNetCore.Mvc;

namespace Group4.FacilitiesReport.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FeedbacksController : ControllerBase
    {
        private readonly IFeedback _iFeedback;
        private readonly IMapper _mapper;
        private readonly IWebHostEnvironment environment;

        public FeedbacksController(IFeedback iFeedback, IMapper mapper, IWebHostEnvironment environment)
        {
            _iFeedback = iFeedback;
            _mapper = mapper;
            this.environment = environment;
        }

        [HttpGet]


        public IActionResult GetAllFeedback()
        {
            var feedbacks = _mapper.Map<List<Feedback>>(_iFeedback.GetAllFeedBack());
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(feedbacks);
        }
        [HttpGet("User/{UserId}")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<TblUser>))]
        public IActionResult GetFeedbackByUserId(string UserId)
        {
            var feedbacks = _mapper.Map<List<Feedback>>(_iFeedback.GetFeedbackByUserId(UserId));
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(feedbacks);
        }
        [HttpGet("Role/{RoleId}")]

        [HttpGet("Date/{BeginDate}_{EndDate}")]
        public IActionResult GetFeedbackByUserRole(string BeginDate, string EndDate)
        {
            var feedbacks = _mapper.Map<List<Feedback>>(_iFeedback.GetFeedbackByDate(BeginDate, EndDate));
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(feedbacks);
        }
        [HttpGet("Notified")]
        public IActionResult GetNotifiedFeedback()
        {
            var feedbacks = _mapper.Map<List<Feedback>>(_iFeedback.GetFeedbackByNotified());
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(feedbacks);
        }
        //[HttpPut("CreateFeedback")]
        //[ProducesResponseType(200, Type = typeof(IEnumerable<TblUser>))]
        //public IActionResult CreateFeedback(string userId, string title, string desctiption)
        //{

        //}
    }
}
