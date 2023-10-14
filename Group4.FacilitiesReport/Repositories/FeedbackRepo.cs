using Group4.FacilitiesReport.DTO.Models;
using Group4.FacilitiesReport.Interface;
using System.Data.Entity;
using System.Globalization;

namespace Group4.FacilitiesReport.Repositories
{
    public class FeedbackRepo : IFeedback
    {
        private readonly FacilitiesFeedbackManagement_SWP391Context _context;
        public FeedbackRepo(FacilitiesFeedbackManagement_SWP391Context context)
        {
            _context = context;
        }

        public ICollection<TblFeedback> GetAllFeedBack()
        {
            var list = _context.TblFeedbacks
                .Include(f => f.User).ToList();
            return list;
        }

        public ICollection<TblFeedback> GetFeedbackByCateId(string cateId) => _context.TblFeedbacks.Where(feedback => feedback.CateId.Equals(cateId)).ToList();

        public ICollection<TblFeedback> GetFeedbackByDate(string beginDate, string endDate)

            => _context.TblFeedbacks.Where(feedback => feedback.DateTime > DateTime.ParseExact(beginDate, "dd-MM-yyyy", CultureInfo.InvariantCulture) && feedback.DateTime < DateTime.ParseExact(endDate, "dd-MM-yyyy", CultureInfo.InvariantCulture)).ToList();

        public ICollection<TblFeedback> GetFeedbackByLocationId(string locationId) => _context.TblFeedbacks.Where(feedback => feedback.LocationId.Equals(locationId)).ToList();


        public ICollection<TblFeedback> GetFeedbackByNotified() => _context.TblFeedbacks.Where(feedback => feedback.Notify == 1).ToList();


        public ICollection<TblFeedback> GetFeedbackByStatus(int status) =>
        _context.TblFeedbacks.Where(feedback => feedback.Status.Equals(status)).ToList();

        public ICollection<TblFeedback> GetFeedbackByUserId(string UserID) => _context.TblFeedbacks.Where(feedback => feedback.UserId.Equals(UserID)).ToList();

        public ICollection<TblFeedback> GetFeedbackByUserRole(int UserRole) => _context.TblFeedbacks.Where(feedback => feedback.User.RoleId.Equals(UserRole)).ToList();

        public bool NotifyFeedback(string feedbackID)
        {
            try
            {
                var obj = _context.TblFeedbacks.SingleOrDefault(feedback => feedback.FeedbackId.Equals(feedbackID));
                if (obj != null)
                {
                    if (obj.Notify == (int)DTO.Enums.FeedbackNotify.IsNotified) obj.Notify = (int)DTO.Enums.FeedbackNotify.NoneNotified;
                    else obj.Notify = (int)DTO.Enums.FeedbackNotify.IsNotified;
                    _context.SaveChanges();
                }
                else
                {
                    return false;
                }

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return true;
        }

        public bool UpdateFeedback(TblFeedback sendFeedback)
        {
            try
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
                }
                else
                {
                    return false;
                }

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return true;
        }

        public bool UpdateFeedbackResponse(string feedbackID, string response)
        {
            try
            {
                var obj = _context.TblFeedbacks.SingleOrDefault(feedback => feedback.FeedbackId.Equals(feedbackID));
                if (obj != null)
                {
                    obj.Response = response;
                    _context.SaveChanges();
                }
                else
                {
                    return false;
                }

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return true;
        }

        public bool UpdateFeedbackStatus(string feedbackID, int status)
        {
            try
            {
                var obj = _context.TblFeedbacks.SingleOrDefault(feedback => feedback.FeedbackId.Equals(feedbackID));
                if (obj != null)
                {

                    obj.Status = status;
                    _context.SaveChanges();
                }
                else
                {
                    return false;
                }

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return true;
        }
    }
}
