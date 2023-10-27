using AutoMapper;
using Group4.FacilitiesReport.DTO;
using Group4.FacilitiesReport.DTO.Models;
using Group4.FacilitiesReport.Interface;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Group4.FacilitiesReport.Repositories
{
    public class FeedbackRepo : IFeedback
    {
        private readonly FacilitiesFeedbackManagement_SWP391Context _context;
        private readonly IMapper _mapper;
        private readonly ILogger<FeedbackRepo> _logger;

        public FeedbackRepo(FacilitiesFeedbackManagement_SWP391Context context, IMapper mapper, ILogger<FeedbackRepo> logger)
        {
            _context = context;
            _mapper = mapper;
            _logger = logger;

        }
        private IQueryable<TblFeedback> AllFeedback() => _context.TblFeedbacks.Include(f => f.Location).Include(f => f.Tasks)
                    .Include(f => f.User).ThenInclude(u => u.Role).Include(f => f.Cate).OrderByDescending(f => f.Notify).ThenBy(f => f.DateTime);
        public async Task<int> CountFeedbackByDate(DateTime beginDate, DateTime endDate)
        {
            return await AllFeedback().Where(f => f.DateTime > beginDate && f.DateTime < endDate).CountAsync();
        }

        public async Task<APIResponse> CreateFeedback(Feedback feedback)
        {
            APIResponse _response = new APIResponse();
            try
            {
                this._logger.LogInformation("Create Begins");
                TblFeedback _feedback = _mapper.Map<Feedback, TblFeedback>(feedback);
                await this._context.TblFeedbacks.AddAsync(_feedback);
                await System.Threading.Tasks.Task.Delay(new TimeSpan(0, 0, 0)).ContinueWith(function =>
                {
                    var oke = UpdateFeedbackStatus(feedback.FeedbackId, 4);
                });
                await this._context.SaveChangesAsync(); ;
                _response.ResponseCode = 200;
                _response.Result = _feedback.FeedbackId.ToString();
            }
            catch (Exception ex)
            {
                _response.ResponseCode = 400;
                _response.ErrorMessage = ex.Message;
                this._logger.LogError(ex.Message, ex);
            }
            return _response;
        }

        public async Task<APIResponse> FeedbackResponse(Guid feedbackId, string response)
        {
            APIResponse _response = new APIResponse();
            try
            {
                TblFeedback? _feedback = await this._context.TblFeedbacks.FindAsync(feedbackId);
                if (_feedback != null)
                {
                    _feedback.Response = response;
                    await this._context.SaveChangesAsync(); ;
                    _response.ResponseCode = 200;
                    _response.Result = _feedback.FeedbackId.ToString();

                }
                else
                {
                    _response.ResponseCode = 404;
                    _response.Result = "Data not found";
                }

            }
            catch (Exception ex)
            {
                _response.ResponseCode = 400;
                _response.ErrorMessage = ex.Message;
            }
            return _response;
        }

        public async Task<List<Feedback>> GetAllFeedBack()
        {
            List<Feedback> _response = new List<Feedback>();
            var _data = await AllFeedback().ToListAsync();
            if (_data != null)
            {
                _response = _mapper.Map<List<TblFeedback>, List<Feedback>>(_data);
            }
            return _response;
        }

        public async Task<Feedback?> GetFeedback(Guid feedbackId)
        {
            Feedback? _response = null;
            var _data = await AllFeedback().Where(f => f.FeedbackId.Equals(feedbackId)).FirstOrDefaultAsync();
            if (_data != null)
            {
                return _mapper.Map<TblFeedback, Feedback>(_data);
            }
            return _response;
        }

        public async Task<List<Feedback>> GetFeedbackByUserId(string UserId)
        {
            List<Feedback> _response = new List<Feedback>();
            var _data = await AllFeedback().Where(f => f.UserId.Equals(UserId)).ToListAsync();
            if (_data != null)
            {
                _response = _mapper.Map<List<TblFeedback>, List<Feedback>>(_data);
            }
            return _response;
        }

        public async Task<APIResponse> NotifyFeedback(Guid feedbackId)
        {
            APIResponse _response = new APIResponse();
            try
            {
                TblFeedback? feedback = await this._context.TblFeedbacks.FindAsync(feedbackId);
                if (feedback != null)
                {
                    if (feedback.Notify == 1) feedback.Notify = 0;
                    else feedback.Notify = 1;
                    await this._context.SaveChangesAsync();

                    _response.ResponseCode = 200;
                    _response.Result = feedbackId.ToString();
                }
                else
                {
                    _response.ResponseCode = 404;
                    _response.Result = "Data not found";
                }
            }
            catch (Exception ex)
            {
                _response.ResponseCode = 400;
                _response.Result = ex.Message;

            }
            return _response;
        }

        public async Task<APIResponse> RemoveFeedback(Guid feedbackId)
        {
            APIResponse _response = new APIResponse();
            try
            {
                TblFeedback? feedback = await this._context.TblFeedbacks.FindAsync(feedbackId);
                if (feedback != null && feedback.Status == 0)
                {
                    var _tasks = await _context.TblTasks.Where(t => t.FeedbackId.Equals(feedbackId)).ToListAsync();
                    this._context.TblTasks.RemoveRange(_tasks);
                    this._context.TblFeedbacks.Remove(feedback);
                    await this._context.SaveChangesAsync();
                    _response.ResponseCode = 200;
                    _response.Result = feedbackId.ToString();
                }
                else if (feedback != null && feedback.Status != 0)
                {
                    _response.ResponseCode = 400;
                    _response.Result = "Feedback is processing now!";
                }
                else
                {
                    _response.ResponseCode = 400;
                    _response.Result = "Data not found!";

                }
            }
            catch (Exception ex)
            {
                _response.ResponseCode = 400;
                _response.Result = ex.Message;

            }
            return _response;

        }

        public async Task<APIResponse> UpdateFeedback(FeedbackUpdatableObject feedback)
        {
            APIResponse _response = new APIResponse();
            try
            {
                TblFeedback? _feedback = await AllFeedback().SingleOrDefaultAsync(f => f.FeedbackId.Equals(feedback.FeedbackId));
                if (_feedback != null && _feedback.Status == 0)
                {
                    _feedback.CateId = feedback.CateId;
                    _feedback.Title = feedback.Title;
                    _feedback.Description = feedback.Description;
                    _feedback.LocationId = feedback.LocationId;
                    await _context.SaveChangesAsync();
                    _response.ResponseCode = 200;
                    _response.Result = feedback.FeedbackId.ToString();
                }
                else if (_feedback != null && _feedback.Status != 0)
                {
                    _response.ResponseCode = 400;
                    _response.Result = "Feedback is processing now!";
                }
                else
                {
                    _response.ResponseCode = 400;
                    _response.Result = "Data not found!";

                }

            }
            catch (Exception ex)
            {
                _response.ResponseCode = 400;
                _response.ErrorMessage = ex.Message;
            }
            return _response;
        }

        public async Task<APIResponse> UpdateFeedbackStatus(Guid feedbackId, int status)
        {
            APIResponse _response = new APIResponse();
            try
            {
                TblFeedback? feedback = await this._context.TblFeedbacks.FindAsync(feedbackId);
                if (feedback != null)
                {
                    feedback.Status = status;
                    await _context.SaveChangesAsync();
                    _response.ResponseCode = 200;
                    _response.Result = feedbackId.ToString();
                }
                else
                {
                    _response.ResponseCode = 400;
                    _response.Result = "Data not found!";

                }
            }
            catch (Exception ex)
            {
                _response.ResponseCode = 400;
                _response.Result = ex.Message;

            }
            return _response;

        }

        public async Task<List<Feedback>> GetFeedbackByStatus(int status)
        {
            List<Feedback> _response = new List<Feedback>();
            var _data = await AllFeedback().Where(f => f.Status == status).ToListAsync();
            if (_data != null)
            {
                _response = _mapper.Map<List<TblFeedback>, List<Feedback>>(_data);
            }
            return _response;
        }

        public async Task<List<Feedback>> GetFeedbackByLocation(string locationId)
        {
            List<Feedback> _response = new List<Feedback>();
            var _data = await AllFeedback().Where(f => f.LocationId == locationId && f.Status < 3 && DateTime.Now.Subtract(f.DateTime).TotalDays < 7).ToListAsync();
            if (_data != null)
            {
                _response = _mapper.Map<List<TblFeedback>, List<Feedback>>(_data);
            }
            return _response;
        }

    }
}
