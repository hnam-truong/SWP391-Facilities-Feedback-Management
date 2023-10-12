using Group4.FacilitiesReport.DTO.Models;

namespace Group4.FacilitiesReport.Interface
{
    public interface IFeedback
    {
        public ICollection<TblFeedback> GetFeedbackByUserId(string UserID);
        public ICollection<TblFeedback> GetAllFeedBack();
        public bool UpdateFeedback(TblFeedback feedback);
        public bool NotifyFeedback(string feedbackID);
        public bool UpdateFeedbackStatus(string feedbackID, int status);
        public ICollection<TblFeedback> GetFeedbackByCateId(string cateId);
        public ICollection<TblFeedback> GetFeedbackByLocationId(string locationId);
        public ICollection<TblFeedback> GetFeedbackByUserRole(int UserRole);
        public ICollection<TblFeedback> GetFeedbackByDate(string beginDate, string endDate);
        public ICollection<TblFeedback> GetFeedbackByStatus(int status);
        public ICollection<TblFeedback> GetFeedbackByNotified();
        public bool UpdateFeedbackResponse(string feedbackID, string response);

    }
}
