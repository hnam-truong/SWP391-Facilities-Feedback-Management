using Group4.FacilitiesReport.DTO.Models;

namespace Group4.FacilitiesReport.Interface
{
    public interface IFeedback
    {
        public Task<List<TblFeedback>> GetFeedbackByUserId(string UserID);
        public List<TblFeedback> GetAllFeedBack();
        public bool UpdateFeedback(TblFeedback feedback);
        public bool NotifyFeedback(string feedbackID);
        public bool UpdateFeedbackStatus(string feedbackID, int status);
        public Task<List<TblFeedback>> GetFeedbackByCateId(string cateId);
        public Task<List<TblFeedback>> GetFeedbackByLocationId(string locationId);
        public Task<List<TblFeedback>> GetFeedbackByUserRole(int UserRole);
        public Task<List<TblFeedback>> GetFeedbackByDate(string beginDate, string endDate);
        public Task<List<TblFeedback>> GetFeedbackByStatus(int status);
        public Task<List<TblFeedback>> GetFeedbackByNotified();
        public bool UpdateFeedbackResponse(string feedbackID, string response);

    }
}
