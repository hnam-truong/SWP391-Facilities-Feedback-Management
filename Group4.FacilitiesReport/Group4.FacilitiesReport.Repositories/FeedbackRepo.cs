﻿using AutoMapper;
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
                    .Include(f => f.User).ThenInclude(u => u.Role).Include(f => f.Cate);
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

        public async Task<Feedback> GetFeedback(Guid feedbackId)
        {
            Feedback _response = new Feedback();
            var _data = await AllFeedback().Where(f => f.FeedbackId.Equals(feedbackId)).FirstOrDefaultAsync();
            if (_data != null)
            {
                return _mapper.Map<TblFeedback, Feedback>(_data);
            }
            return null;
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
                    this._context.TblFeedbacks.Remove(feedback);
                    await this._context.SaveChangesAsync();
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

        public async Task<APIResponse> UpdateFeedback(Feedback feedback)
        {
            APIResponse _response = new APIResponse();
            try
            {
                TblFeedback? _feedback = await AllFeedback().SingleOrDefaultAsync(f => f.FeedbackId.Equals(feedback.FeedbackId));
                if (feedback != null)
                {
                    _feedback.CateId = feedback.CateId;
                    _feedback.Response = feedback.Response;
                    _feedback.Title = feedback.Title;
                    _feedback.Description = feedback.Description;
                    _feedback.LocationId = feedback.LocationId;
                    await _context.SaveChangesAsync();

                    _response.ResponseCode = 200;
                    _response.Result = feedback.FeedbackId.ToString();
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
    }
}
