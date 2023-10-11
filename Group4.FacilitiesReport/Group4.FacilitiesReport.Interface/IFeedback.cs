using Group4.FacilitiesReport.DTO;
using Group4.FacilitiesReport.DTO.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Group4.FacilitiesReport.Interface
{
    public interface IFeedback
    {
        public ICollection<TblFeedback> GetFeedbackByUserId(string UserID);
        public ICollection<TblFeedback> GetAllFeedBack();
        public bool UpdateFeedback(DTO.Feedback feedback);
        public bool NotifyFeedback(string feedbackID);
        public bool UpdateFeedbackResponse(DTO.Feedback feedback);
        public bool UpdateFeedbackStatus(string feedbackID, int status);
        public ICollection<TblFeedback> GetFeedbackByCateId(string cateId);
        public ICollection<TblFeedback> GetFeedbackByLocationId(string locationId);
        public ICollection<TblFeedback> GetFeedbackByUserRole(int roleId);
        public ICollection<TblFeedback> GetFeedbackByDate(DateTime date);
        public ICollection<TblFeedback> GetFeedbackByStatus(int status);
        public ICollection<TblFeedback> GetFeedbackByNotified();
    }
}
