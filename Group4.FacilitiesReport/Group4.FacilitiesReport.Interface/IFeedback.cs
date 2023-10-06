using Group4.FacilitiesReport.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Group4.FacilitiesReport.Interface
{
    public interface IFeedback
    {
        public Feedback GetFeedbackByUserID(string UserID);
        public Feedback GetAllFeedBack();
        public bool UpdateFeedback(DTO.Feedback feedback);
        public bool NotifyFeedback(string feedbackID);
        public bool UpdateFeedbackResponse(DTO.Feedback feedback);
        public bool UpdateFeedbackStatus(string feedbackID, int status);
    }
}
