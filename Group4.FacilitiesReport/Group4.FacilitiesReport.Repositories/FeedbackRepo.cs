using Group4.FacilitiesReport.DTO.Models;
using Group4.FacilitiesReport.Interface;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

namespace Group4.FacilitiesReport.Repositories
{
    public class FeedbackRepo : IFeedback
    {
        private readonly FacilitiesFeedbackManagement_SWP391Context _context;
        private IQueryable<TblFeedback> AllFeedback;
        public FeedbackRepo(FacilitiesFeedbackManagement_SWP391Context context)
        {
            _context = context;
            AllFeedback = _context.TblFeedbacks
                .Include(f => f.User).ThenInclude(u => u.Role).Include(f => f.Cate).Include(f => f.Location).Include(f => f.Tasks);
        }

        public List<TblFeedback> GetAllFeedBack() => AllFeedback.ToList();
        public Task<List<TblFeedback>> GetFeedbackByCateId(string cateId) => AllFeedback.Where(feedback => feedback.CateId.Equals(cateId)).ToListAsync();

        public Task<List<TblFeedback>> GetFeedbackByDate(string beginDate, string endDate)

            => AllFeedback.Where(feedback => feedback.DateTime > DateTime.ParseExact(beginDate, "dd-MM-yyyy", CultureInfo.InvariantCulture) && feedback.DateTime < DateTime.ParseExact(endDate, "dd-MM-yyyy", CultureInfo.InvariantCulture)).ToListAsync();

        public TblFeedback GetFeedbackById(string feedbackId)
        {
            return AllFeedback.FirstOrDefault(f => f.FeedbackId.Equals(feedbackId));
        }

        public Task<List<TblFeedback>> GetFeedbackByLocationId(string locationId) => AllFeedback.Where(feedback => feedback.LocationId.Equals(locationId)).ToListAsync();


        public Task<List<TblFeedback>> GetFeedbackByNotified() => AllFeedback.Where(feedback => feedback.Notify == 1).ToListAsync();


        public Task<List<TblFeedback>> GetFeedbackByStatus(int status) =>
        AllFeedback.Where(feedback => feedback.Status.Equals(status)).ToListAsync();

        public Task<List<TblFeedback>> GetFeedbackByUserId(string UserID) => AllFeedback.Where(feedback => feedback.UserId.Equals(UserID)).ToListAsync();

        public Task<List<TblFeedback>> GetFeedbackByUserRole(int UserRole) => AllFeedback.Where(feedback => feedback.User.RoleId.Equals(UserRole)).ToListAsync();

        public bool NotifyFeedback(string feedbackID)
        {
            var obj = _context.TblFeedbacks.SingleOrDefault(feedback => feedback.FeedbackId.Equals(feedbackID));
            if (obj != null)
            {
                if (obj.Notify == 0) obj.Notify = 1;
                else obj.Notify = 0;
                _context.SaveChanges();
                return true;

            }
            return false;
        }

        public bool UpdateFeedback(TblFeedback sendFeedback)
        {
            var obj = _context.TblFeedbacks.SingleOrDefault(feedback => feedback.FeedbackId.Equals(sendFeedback.FeedbackId));
            if (obj != null)
            {
                obj.CateId = sendFeedback.CateId;
                obj.Status = sendFeedback.Status;
                obj.Description = sendFeedback.Description;
                obj.Location = sendFeedback.Location;
                obj.ImgUrl = sendFeedback.ImgUrl;
                obj.VideoUrl = sendFeedback.VideoUrl;
                _context.SaveChanges();
                return true;

            }
            return false;
        }

        public bool UpdateFeedbackResponse(string feedbackID, string response)
        {
            var obj = _context.TblFeedbacks.SingleOrDefault(feedback => feedback.FeedbackId.Equals(feedbackID));
            if (obj != null)
            {
                obj.Response = response;
                _context.SaveChanges();
                return true;

            }
            return false;
        }

        public bool UpdateFeedbackStatus(string feedbackID, int status)
        {
            var obj = _context.TblFeedbacks.SingleOrDefault(feedback => feedback.FeedbackId.Equals(feedbackID));
            if (obj != null)
            {
                obj.Status = status;
                _context.SaveChanges();
                return true;
            }
            return false;

        }
    }
}
