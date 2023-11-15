using Group4.FacilitiesReport.DTO;

namespace Group4.FacilitiesReport.Interface
{
    public interface IFeedback
    {
        public Task<List<DTO.Feedback>> GetFeedbackByUserId(string UserId);
        public Task<List<DTO.Feedback>> GetAllFeedBack();
        public Task<int> CountFeedbackByDate(DateTime beginDate, DateTime endDate);
        public Task<int> CountFeedbackClosedByDate();
        public Task<int> CountFeedbackClosed();
        public Task<List<DTO.Feedback>> GetFeedbackByStatus(int status);
        public Task<List<DTO.Feedback>> GetFeedbackByLocation(string locationId);
        public Task<DTO.Feedback?> GetFeedback(Guid feedbackId);
        public Task<APIResponse> CreateFeedback(DTO.Feedback feedback);
        public Task<APIResponse> UpdateFeedback(DTO.FeedbackUpdatableObject feedback);
        public Task<APIResponse> NotifyFeedback(Guid feedbackID);
        public Task<APIResponse> AcceptFeedback(Guid feedbackId, string response);
        public Task<APIResponse> RejectFeedback(Guid feedbackId, string response);
        public Task<APIResponse> CancelAcceptFeedback(Guid feedbackId, string response);
        public Task<APIResponse> UndoRejectFeedback(Guid feedbackId, string response);
        //public void ExpiredFeedback(Guid feedbackId);
        public Task<APIResponse> CloseFeedback(Guid feedbackId, string response);
        public Task<APIResponse> RespondFeedback(Guid feedbackId, string response);
        public Task<APIResponse> RemoveFeedback(Guid feedbackId);
        public Task<List<FeedbackGraphObject>> RecentGraphFeedback();
        public Task<List<FeedbackGraphObject>> MonthlyGraphFeedback();
        public Task<List<Feedback>> GetFeedbacksByCate(string id);
        public Task<List<FeedbackGraphObject>> RecentUserCreateFeedback();
        public Task<int> CountUserByDate(DateTime beginDate, DateTime endDate);
    }
}