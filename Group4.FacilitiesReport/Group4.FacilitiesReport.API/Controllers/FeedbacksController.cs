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

        public FeedbacksController(IFeedback iFeedback, IMapper mapper)
        {
            _iFeedback = iFeedback;
            _mapper = mapper;
        }

        [HttpGet]
        [ProducesResponseType(200, Type = typeof(IEnumerable<TblUser>))]

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
        [ProducesResponseType(200, Type = typeof(IEnumerable<TblUser>))]
        public IActionResult GetFeedbackByUserRole(int RoleId)
        {
            var feedbacks = _mapper.Map<List<Feedback>>(_iFeedback.GetFeedbackByUserRole(RoleId));
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(feedbacks);
        }
        [HttpGet("Location/{LocationId}")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<TblUser>))]
        public IActionResult GetFeedbackByLocation(string LocationId)
        {
            var feedbacks = _mapper.Map<List<Feedback>>(_iFeedback.GetFeedbackByLocationId(LocationId));

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(feedbacks);
        }
        [HttpGet("Category/{CateId}")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<TblUser>))]
        public IActionResult GetFeedbackByCategory(string CateId)
        {
            var feedbacks = _mapper.Map<List<Feedback>>(_iFeedback.GetFeedbackByCateId(CateId));
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(feedbacks);
        }
        [HttpGet("Status/{Status}")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<TblUser>))]
        public IActionResult GetFeedbackByStatus(int Status)
        {
            var feedbacks = _mapper.Map<List<Feedback>>(_iFeedback.GetFeedbackByStatus(Status));
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(feedbacks);
        }
        [HttpGet("Date/{BeginDate}_{EndDate}")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<TblUser>))]
        public IActionResult GetFeedbackByUserRole(string BeginDate, string EndDate)
        {
            var feedbacks = _mapper.Map<List<Feedback>>(_iFeedback.GetFeedbackByDate(BeginDate, EndDate));
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(feedbacks);
        }
        [HttpGet("Notified")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<TblUser>))]
        public IActionResult GetNotifiedFeedback()
        {
            var feedbacks = _mapper.Map<List<Feedback>>(_iFeedback.GetFeedbackByNotified());
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(feedbacks);
        }

        //[HttpGet("")]
        //[ProducesResponseType(200, Type = typeof(IEnumerable<TblUser>))]
        //public IActionResult GetNotifiedFeedback()
        //{
        //    var feedbacks = _mapper.Map<List<Feedback>>(_iFeedback.GetFeedbackByNotified());
        //    if (!ModelState.IsValid)
        //        return BadRequest(ModelState);

        //    return Ok(feedbacks);
        //}
    }
}
