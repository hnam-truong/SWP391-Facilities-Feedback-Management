using AutoMapper;
using Group4.FacilitiesReport.DTO;
using Group4.FacilitiesReport.DTO.Models;
using Group4.FacilitiesReport.Interface;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Globalization;
using System.Timers;

namespace Group4.FacilitiesReport.Repositories
{
    public class FeedbackRepo : IFeedback
    {
        private readonly FacilitiesFeedbackManagement_SWP391Context _context;
        private readonly IMapper _mapper;
        private readonly ILogger<FeedbackRepo> _logger;
        private readonly IConfig _config;

        public FeedbackRepo(FacilitiesFeedbackManagement_SWP391Context context, IMapper mapper, ILogger<FeedbackRepo> logger, IConfig config)
        {
            _context = context;
            _mapper = mapper;
            _logger = logger;
            _config = config;
        }
        private IQueryable<TblFeedback> AllFeedback() => _context.TblFeedbacks.Include(f => f.Location).Include(f => f.Tasks).ThenInclude(t => t.Employee).Include(f => f.Tasks).ThenInclude(t => t.Manager)
                    .Include(f => f.User).ThenInclude(u => u.Role).Include(f => f.Cate).OrderByDescending(f => f.Notify).ThenByDescending(f => f.DateTime);
        public async Task<int> CountFeedbackByDate(DateTime beginDate, DateTime endDate)
        {
            _logger.LogInformation("Begin Count Feedback by Date");
            return await AllFeedback().Where(f => f.DateTime >= beginDate && f.DateTime <= endDate).CountAsync();
        }
        public async Task<int> CountFeedbackClosedByDate()

        {
            _logger.LogInformation("Begin Count Feedback Closed by Date");
            var today = DateTime.Now.Date;
            return await AllFeedback().Where(f => f.DateTime.Date == today && f.Status == (int)Enum.Parse(typeof(DTO.Enums.FeedbackStatus), "Closed")).CountAsync();
        }
        public async Task<int> CountFeedbackClosed()
        {
            _logger.LogInformation("Begin Count Feedback by Date");
            return await AllFeedback().Where(f => f.Status == (int)Enum.Parse(typeof(DTO.Enums.FeedbackStatus), "Closed")).CountAsync();
        }

        public async Task<APIResponse> CreateFeedback(Feedback feedback)
        {
            APIResponse _response = new APIResponse();
            var exist = await CheckExistence(feedback.LocationId, feedback.CateId);

            if (exist && feedback.Status == "Waiting" || feedback.Status == "Processing")
            {
                _response.ResponseCode = 400;
                _response.ErrorMessage = "Type of Feedback is already exist";
                return _response;
            }
            else
            {
                try
                {
                    this._logger.LogInformation("Create Begins");
                    TblFeedback _feedback = _mapper.Map<Feedback, TblFeedback>(feedback);
                    await this._context.TblFeedbacks.AddAsync(_feedback);
                    await this._context.SaveChangesAsync();
                    _response.ResponseCode = 200;
                    _response.Result = _feedback.FeedbackId.ToString();
                }
                catch (Exception ex)
                {
                    _response.ResponseCode = 400;
                    _response.ErrorMessage = ex.Message;
                    this._logger.LogError(ex.Message, ex);
                }
            }

            return _response;
        }




        public async Task<APIResponse> RespondFeedback(Guid feedbackId, string response)
        {
            APIResponse _response = new APIResponse();
            try
            {
                _logger.LogInformation("Begin Responsd Feedback");
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
                _logger.LogError(ex.Message, ex);
            }
            return _response;
        }

        public async Task<List<Feedback>> GetAllFeedBack()
        {
            _logger.LogInformation("Begin Get All Feedbacks");
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
            _logger.LogInformation("Begin Get Feedback by Id");

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
            _logger.LogInformation("Begin Get Feedback by UserId");

            List<Feedback> _response = new List<Feedback>();
            var _data = await AllFeedback().Where(f => f.UserId.ToLower().Equals(UserId.ToLower())).ToListAsync();
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
                _logger.LogInformation("Begin Notify Feedback");
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
                _logger.LogError(ex.Message, ex);
            }
            return _response;
        }

        public async Task<APIResponse> RemoveFeedback(Guid feedbackId)
        {
            _logger.LogInformation("Begin Remove Feedback");
            APIResponse response = new APIResponse();
            var _feedback = await _context.TblFeedbacks.FirstOrDefaultAsync(t => t.FeedbackId == feedbackId);
            if (_feedback != null && _feedback.Status == 0)
                response = await UpdateFeedbackStatus(feedbackId, 6);
            else
            {
                response.ResponseCode = 404;
                response.ErrorMessage = "Feedback not available";
            }
            return response;

        }

        //public async Task<APIResponse> UpdateFeedback(FeedbackUpdatableObject feedback)
        //{
        //    APIResponse _response = new APIResponse();
        //    try
        //    {
        //        _logger.LogInformation("Begin Update Feedback");
        //        TblFeedback? _feedback = await AllFeedback().SingleOrDefaultAsync(f => f.FeedbackId.Equals(feedback.FeedbackId));

        //        if (_feedback != null && _feedback.Status == 0)
        //        {
        //            _feedback.CateId = feedback.CateId;
        //            _feedback.Title = feedback.Title;
        //            _feedback.Description = feedback.Description;
        //            _feedback.LocationId = feedback.LocationId;
        //            var exists = await _context.TblFeedbacks.AnyAsync(f => f.LocationId == feedback.LocationId && f.CateId == feedback.CateId && f.FeedbackId != feedback.FeedbackId && (f.Status == 0 || f.Status == 1));
        //            if (exists == null)
        //            {
        //                await _context.SaveChangesAsync();
        //                _response.ResponseCode = 200;
        //                _response.Result = feedback.FeedbackId.ToString();
        //            }
        //            else
        //            {
        //                _response.ResponseCode = 4000;
        //                _response.Result = "Type Exists";
        //            }
        //        }
        //        else if (_feedback != null && _feedback.Status != 0)
        //        {
        //            _response.ResponseCode = 400;
        //            _response.Result = "Invalid Call!";
        //        }
        //        else
        //        {
        //            _response.ResponseCode = 400;
        //            _response.Result = "Data not found!";

        //        }

        //    }
        //    catch (Exception ex)
        //    {
        //        _response.ResponseCode = 400;
        //        _response.ErrorMessage = ex.Message;
        //        _logger.LogError(ex.Message, ex);
        //    }
        //    return _response;
        //}
        public async Task<APIResponse> UpdateFeedback(FeedbackUpdatableObject feedback)
        {
            APIResponse _response = new APIResponse();
            try
            {
                _logger.LogInformation("Begin Update Feedback");
                TblFeedback? _feedback = await AllFeedback().SingleOrDefaultAsync(f => f.FeedbackId.Equals(feedback.FeedbackId));

                if (_feedback != null && _feedback.Status == 0)
                {
                    var exists = await _context.TblFeedbacks.AnyAsync(f => f.LocationId == feedback.LocationId && f.CateId == feedback.CateId && f.FeedbackId != feedback.FeedbackId && (f.Status == 0 || f.Status == 1));
                    if (!exists)
                    {
                        _feedback.CateId = feedback.CateId;
                        _feedback.Title = feedback.Title;
                        _feedback.Description = feedback.Description;
                        _feedback.LocationId = feedback.LocationId;
                        await _context.SaveChangesAsync();
                        _response.ResponseCode = 200;
                        _response.Result = feedback.FeedbackId.ToString();
                    }
                    else
                    {
                        _response.ResponseCode = 4000;
                        _response.ErrorMessage = "Type Exists";
                    }
                }
                else if (_feedback != null && _feedback.Status != 0)
                {
                    _response.ResponseCode = 400;
                    _response.ErrorMessage = "Invalid Call!";
                }
                else
                {
                    _response.ResponseCode = 404;
                    _response.ErrorMessage = "Data not found!";
                }
            }
            catch (Exception ex)
            {
                _response.ResponseCode = 400;
                _response.ErrorMessage = ex.Message;
                _logger.LogError(ex.Message, ex);
            }
            return _response;
        }

        public async Task<APIResponse> UpdateFeedbackStatus(Guid feedbackId, int status)
        {
            APIResponse _response = new APIResponse();
            try
            {
                _logger.LogInformation("Begin Update Status of Feedback");
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
                    _response.ResponseCode = 404;
                    _response.Result = "Data not found!";

                }
            }
            catch (Exception ex)
            {
                _response.ResponseCode = 400;
                _response.Result = ex.Message;
                _logger.LogError(ex.Message, ex);
            }
            return _response;

        }

        public async Task<List<Feedback>> GetFeedbackByStatus(int status)
        {
            _logger.LogInformation("Begin Get Feedback by Status");
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
            _logger.LogInformation("Begin Get Feedback by Location");
            List<Feedback> _response = new List<Feedback>();
            var _data = await AllFeedback().Where(f => f.LocationId.ToLower() == locationId.ToLower() && f.Status < 3 && DateTime.Now.Subtract(f.DateTime).TotalDays < 7).ToListAsync();
            if (_data != null)
            {
                _response = _mapper.Map<List<TblFeedback>, List<Feedback>>(_data);
            }
            return _response;
        }

        public async Task<APIResponse> AcceptFeedback(Guid feedbackId, string response)
        {
            _logger.LogInformation("Begin Accept Feedback");
            var item = await GetFeedback(feedbackId);
            if (item != null && item.Status == "Waiting")
            {
                await RespondFeedback(feedbackId, response);
                return await UpdateFeedbackStatus(feedbackId, (int)Enum.Parse(typeof(DTO.Enums.FeedbackStatus), "Processing"));
            }
            return new APIResponse { ResponseCode = 400, ErrorMessage = "Invalid Call" };
        }

        public async Task<APIResponse> RejectFeedback(Guid feedbackId, string response)
        {
            _logger.LogInformation("Begin Reject Feedback");
            var item = await GetFeedback(feedbackId);
            if (item != null && item.Status == "Waiting")
            {
                await RespondFeedback(feedbackId, response);
                return await UpdateFeedbackStatus(feedbackId, (int)Enum.Parse(typeof(DTO.Enums.FeedbackStatus), "Rejected"));
            }
            return new APIResponse { ResponseCode = 400, ErrorMessage = "Invalid Call" };
        }

        public async Task<APIResponse> CancelAcceptFeedback(Guid feedbackId, string response)
        {
            _logger.LogInformation("Begin Cancel Feedback");
            var item = await GetFeedback(feedbackId);
            if (item != null && item.Status == "Processing")
            {
                await RespondFeedback(feedbackId, response);
                var list = _context.TblTasks.Where(t => t.FeedbackId == feedbackId).ToListAsync();
                if (list != null)
                    foreach (var task in await list)
                    {
                        task.Status = (int)Enum.Parse(typeof(DTO.Enums.TaskStatus), "Cancelled");
                        await _context.SaveChangesAsync();
                    }


                return await UpdateFeedbackStatus(feedbackId, (int)Enum.Parse(typeof(DTO.Enums.FeedbackStatus), "Waiting"));
            }
            return new APIResponse { ResponseCode = 400, ErrorMessage = "Invalid Call" };

        }

        public async Task<APIResponse> UndoRejectFeedback(Guid feedbackId, string response)
        {
            _logger.LogInformation("Begin Undo Reject Feedback");
            var item = await GetFeedback(feedbackId);
            if (item != null && item.Status == "Rejected")
            {
                await RespondFeedback(feedbackId, response);
                return await UpdateFeedbackStatus(feedbackId, (int)Enum.Parse(typeof(DTO.Enums.FeedbackStatus), "Processing"));
            }
            return new APIResponse { ResponseCode = 400, ErrorMessage = "Invalid Call" };

        }

        public async Task<APIResponse> CloseFeedback(Guid feedbackId, string response)
        {
            _logger.LogInformation("Begin Close Feedback");
            var item = await GetFeedback(feedbackId);
            if (item != null && item.Status == "Responded")
            {
                await RespondFeedback(feedbackId, response);
                var list = _context.TblTasks.Where(t => t.FeedbackId == feedbackId).ToListAsync();
                if (list != null)
                    foreach (var task in await list)
                    {
                        task.Status = (int)Enum.Parse(typeof(DTO.Enums.TaskStatus), "Closed");
                        await _context.SaveChangesAsync();
                    }
                return await UpdateFeedbackStatus(feedbackId, (int)Enum.Parse(typeof(DTO.Enums.FeedbackStatus), "Closed"));

            }
            return new APIResponse { ResponseCode = 400, ErrorMessage = "Invalid Call" };

        }

        public async Task<bool> CheckExistence(string locationId, string cateId)
        {
            _logger.LogInformation("Begin Check Exist Feedback");
            var exists = await _context.TblFeedbacks.AnyAsync(f => f.LocationId == locationId && f.CateId == cateId);
            return exists;
        }
        //public async Task<List<FeedbackGraphObject>> RecentGraphFeedback()
        //{
        //    var now = DateTime.Now.AddDays(-7).Date;
        //    var list = new List<FeedbackGraphObject>();
        //    for (int i = 0; i <= 7; i++)
        //    {
        //        list.Add(new FeedbackGraphObject
        //        {
        //            Date = now.DayOfWeek.ToString(),
        //            Amount = (await CountFeedbackByDate(now, now)).ToString()
        //        });
        //        now = now.AddDays(1);
        //    }
        //    return list;
        //}

        //public async Task<List<FeedbackGraphObject>> MonthlyGraphFeedback()
        //{
        //    var now = DateTime.Now.AddMonths(-12);
        //    var list = new List<FeedbackGraphObject>();
        //    for (int i = 0; i <= 12; i++)
        //    {
        //        DateTime date = now;
        //        var firstDayOfMonth = new DateTime(date.Year, date.Month, 1);
        //        var lastDayOfMonth = firstDayOfMonth.AddMonths(1).AddSeconds(-1);
        //        list.Add(new FeedbackGraphObject
        //        {
        //            Date = now.Month.ToString(),
        //            Amount = (await CountFeedbackByDate(firstDayOfMonth, lastDayOfMonth)).ToString()
        //        });
        //        now = now.AddMonths(1);
        //    }
        //    return list;
        //}
        public async Task<List<FeedbackGraphObject>> RecentGraphFeedback()
        {
            _logger.LogInformation("Begin Recent Graph");
            var now = DateTime.Now.Date.AddDays(-6);
            var list = new List<FeedbackGraphObject>();
            for (int i = 0; i <= 6; i++)
            {
                list.Add(new FeedbackGraphObject { Date = now.DayOfWeek.ToString(), Amount = await CountFeedbackByDate(now.AddSeconds(-1), now.AddDays(1)) });
                now = now.AddDays(1);
            }
            return list;
        }


        public async Task<List<FeedbackGraphObject>> MonthlyGraphFeedback()
        {
            _logger.LogInformation("Begin Monthly Graph");
            var now = DateTime.Now.AddMonths(-11);
            var list = new List<FeedbackGraphObject>();
            for (int i = 0; i < 12; i++)
            {
                var firstDayOfMonth = new DateTime(now.Year, now.Month, 1);
                var lastDayOfMonth = firstDayOfMonth.AddMonths(1).AddSeconds(-1);
                list.Add(new FeedbackGraphObject
                {
                    Date = now.ToString("yyyy-MM"),
                    Amount = (await CountFeedbackByDate(firstDayOfMonth, lastDayOfMonth))
                });
                now = now.AddMonths(1);
            }
            return list;
        }
        public async Task<List<Feedback>> GetFeedbacksByCate(string id)
        {
            _logger.LogInformation("Begin Get Feedback by Category");
            var list = await AllFeedback().Where(f => f.CateId == id).ToListAsync();
            return _mapper.Map<List<Feedback>>(list);
        }
        public async Task<List<FeedbackGraphObject>> RecentUserCreateFeedback()
        {
            _logger.LogInformation("Begin Recent User Create Feedback");
            var now = DateTime.Now.Date.AddDays(-6);
            var list = new List<FeedbackGraphObject>();
            for (int i = 0; i <= 6; i++)
            {
                list.Add(new FeedbackGraphObject { Date = now.DayOfWeek.ToString(), Amount = await CountUserByDate(now.AddSeconds(-1), now.AddDays(1)) });
                now = now.AddDays(1);
            }
            return list;
        }
        public async Task<int> CountUserByDate(DateTime beginDate, DateTime endDate)
        {
            _logger.LogInformation("Begin Count User By Date");
            var count = await _context.TblUsers.Include(u => u.TblFeedbacks).Where(u => u.TblFeedbacks.Where(f => f.DateTime > beginDate && f.DateTime < endDate).Count() != 0).CountAsync();
            return count;
        }
    }
}