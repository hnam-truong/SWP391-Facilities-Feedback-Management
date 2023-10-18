using Group4.FacilitiesReport.DTO;

namespace Group4.FacilitiesReport.Interface
{
    public interface IFeedback
    {
        public Task<List<DTO.Feedback>> GetFeedbackByUserId(string UserId);
        public Task<List<DTO.Feedback>> GetAllFeedBack();
        public Task<APIResponse> UpdateFeedback(DTO.Feedback feedback);
        public Task<APIResponse> NotifyFeedback(string feedbackID);
        public Task<APIResponse> UpdateFeedbackStatus(string feedbackId, int status);
        public Task<APIResponse> FeedbackResponse(string feedbackId, string response);
        public Task<DTO.Feedback> GetFeedback(string feedbackId);
        public Task<APIResponse> CreateFeedback(DTO.Feedback feedback);
        public Task<APIResponse> RemoveFeedback(string feedbackId);
        public Task<int> CountFeedbackByDate(DateTime beginDate, DateTime endDate);
    }
}
