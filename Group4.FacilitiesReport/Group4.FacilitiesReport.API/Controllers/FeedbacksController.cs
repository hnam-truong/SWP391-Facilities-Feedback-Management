using Group4.FacilitiesReport.DTO;
using Group4.FacilitiesReport.Interface;
using Microsoft.AspNetCore.Mvc;

namespace Group4.FacilitiesReport.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
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

        [HttpPut("UpdateStatus")]
        public async Task<IActionResult> UpdateFeedbackStatus(string feedbackId, string status)
        {
            Enum.TryParse(status, out DTO.Enums.FeedbackStatus enumValue);
            var feedback = this._ifeedback.UpdateFeedbackStatus(feedbackId, (int)enumValue);
            return Ok(feedback);
        }


    }
}
