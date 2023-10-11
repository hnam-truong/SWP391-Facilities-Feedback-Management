using Group4.FacilitiesReport.DTO;
using Group4.FacilitiesReport.DTO.Models;
using Group4.FacilitiesReport.Interface;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Group4.FacilitiesReport.Repositories
{
    internal class FeedbackRepo : IFeedback
    {
        private readonly FacilitiesFeedbackManagement_SWP391Context _context;
        public FeedbackRepo(FacilitiesFeedbackManagement_SWP391Context context)
        {
            _context = context;
        }

        public ICollection<TblFeedback> GetAllFeedBack() => _context.TblFeedbacks.OrderByDescending(feedback => feedback.Notify).ThenBy(feedback => feedback.DateTime).ToList();

        public ICollection<TblFeedback> GetFeedbackByCateId(string cateId) => _context.TblFeedbacks.Where(feedback => feedback.CateId.Equals(cateId)).ToList();
        
        public ICollection<TblFeedback> GetFeedbackByDate(DateTime date) => _context.TblFeedbacks.Where(feedback => feedback.d)
        public ICollection<TblFeedback> GetFeedbackByLocationId(string locationId)
        {
            throw new NotImplementedException();
        }

        public ICollection<TblFeedback> GetFeedbackByNotified()
        {
            throw new NotImplementedException();
        }

        public ICollection<TblFeedback> GetFeedbackByStatus(int status)
        {
            throw new NotImplementedException();
        }

        public ICollection<TblFeedback> GetFeedbackByUserId(string UserID)
        {
            throw new NotImplementedException();
        }

        public ICollection<TblFeedback> GetFeedbackByUserRole(int roleId)
        {
            throw new NotImplementedException();
        }

        public bool NotifyFeedback(string feedbackID)
        {
            throw new NotImplementedException();
        }

        public bool UpdateFeedback(Feedback feedback)
        {
            throw new NotImplementedException();
        }

        public bool UpdateFeedbackResponse(Feedback feedback)
        {
            throw new NotImplementedException();
        }

        public bool UpdateFeedbackStatus(string feedbackID, int status)
        {
            throw new NotImplementedException();
        }
    }
