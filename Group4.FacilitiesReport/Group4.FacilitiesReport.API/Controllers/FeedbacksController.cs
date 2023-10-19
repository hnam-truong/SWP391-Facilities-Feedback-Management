using Group4.FacilitiesReport.DTO;
using Group4.FacilitiesReport.Interface;
using Microsoft.AspNetCore.Mvc;

namespace Group4.FacilitiesReport.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize]
    public class FeedbacksController : ControllerBase
    {
        private readonly IFeedback _ifeedback;

        public FeedbacksController(IFeedback ifeedback)
        {
            _ifeedback = ifeedback;
        }

        [HttpGet("AllFeedbacks")]
        public async Task<IActionResult> GetAllFeedback()
        {
            var feedbacks = await this._ifeedback.GetAllFeedBack();
            if (feedbacks == null)
            {
                return NotFound();
            }
            return Ok(feedbacks);
        }
        [HttpGet("User/{UserId}")]
        public async Task<IActionResult> GetFeedbackByUserId(string UserId)
        {
            var feedbacks = await this._ifeedback.GetFeedbackByUserId(UserId);
            if (feedbacks == null)
            {
                return NotFound();
            }
            return Ok(feedbacks);
        }
        [HttpGet("Id/{feedbackId}")]
        public async Task<IActionResult> GetFeedback(Guid feedbackId)
        {
            var feedbacks = await this._ifeedback.GetFeedback(feedbackId);
            if (feedbacks == null)
            {
                return NotFound();
            }
            return Ok(feedbacks);
        }
        [HttpGet("Count")]
        public async Task<IActionResult> CountFeedback(DateTime beginDate, DateTime endDate)
        {
            int count = await this._ifeedback.CountFeedbackByDate(beginDate, endDate);
            return Ok(count);
        }
        [HttpPost("Create")]
        public async Task<IActionResult> CreateFeedback(string userId, string title, string description, string cateId, string locatoinId)
        {
            var feedback = await this._ifeedback.CreateFeedback(new Feedback
            {
                FeedbackId = Guid.NewGuid(),
                UserId = userId,
                Title = title,
                Description = description,
                CateId = cateId,
                LocationId = locatoinId,
                Notify = 0,
                DateTime = DateTime.Now
            });
            return Ok(feedback);
        }
        [HttpPut("Update")]
        public async Task<IActionResult> UpdateFeedback(Guid feedbackId, string userId, string title, string description, string cateId, string locatoinId)
        {
            var feedback = await this._ifeedback.UpdateFeedback(new Feedback
            {
                FeedbackId = feedbackId,
                UserId = userId,
                Title = title,
                Description = description,
                CateId = cateId,
                LocationId = locatoinId,
            });
            return Ok(feedback);
        }

        [HttpPut("Notify")]
        public async Task<IActionResult> NotifyFeedback(string feedbackId)
        {
            var feedback = await this._ifeedback.NotifyFeedback(feedbackId);
            return Ok(feedback);
        }

        [HttpPut("UpdateStatus")]
        public async Task<IActionResult> UpdateFeedbackStatus(string feedbackId, string status)
        {
            Enum.TryParse(status, out DTO.Enums.FeedbackStatus enumValue);
            var feedback = await this._ifeedback.UpdateFeedbackStatus(feedbackId, (int)enumValue);
            return Ok(feedback);
        }

        [HttpPut("ResponseFeedback")]
        public async Task<IActionResult> ResponseFeedback(string feedbackId, string description)
        {
            var feedback = await this._ifeedback.FeedbackResponse(feedbackId, description);
            return Ok(feedback);
        }
        [HttpDelete("RemoveFeedback/{feedbackId}")]
        public async Task<IActionResult> RemoveFeedback(string feedbackId)
        {
            return Ok(await _ifeedback.RemoveFeedback(feedbackId));
        }
    }
}
