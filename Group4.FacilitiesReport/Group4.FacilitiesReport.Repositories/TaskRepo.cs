using AutoMapper;
using Group4.FacilitiesReport.DTO;
using Group4.FacilitiesReport.DTO.Models;
using Group4.FacilitiesReport.Interface;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Data;
using System.Threading.Tasks;

namespace Group4.FacilitiesReport.Repositories
{
    public class TaskRepo : ITasks
    {
        private readonly FacilitiesFeedbackManagement_SWP391Context _context;
        private readonly IMapper _mapper;
        private readonly ILogger<TaskRepo> _logger;

        public TaskRepo(FacilitiesFeedbackManagement_SWP391Context context, IMapper mapper, ILogger<TaskRepo> logger)
        {
            _context = context;
            _mapper = mapper;
            _logger = logger;
        }

        private IQueryable<TblTask> AllTask() => _context.TblTasks;

        public async Task<APIResponse> CreateTask(DTO.Task task)
        {
            APIResponse response = new APIResponse();
            try
            {
                
                TblTask _task = _mapper.Map<DTO.Task, TblTask>(task);
                await _context.TblTasks.AddAsync(_task);
                await _context.SaveChangesAsync();
                response.ResponseCode = 201;
                response.Result = task.Id.ToString();
            }
            catch (Exception ex)
            {
                response.ResponseCode = 400;
                response.ErrorMessage = ex.Message;
            }
            return response;
        }

        public async Task<APIResponse> DeleteTask(int id)
        {
            APIResponse _response = new APIResponse();
            try
            {
                TblTask? task = await _context.TblTasks.FindAsync(id);
                if (task != null && task.Status == 0)
                {
                    _context.TblTasks.Remove(task);
                    await _context.SaveChangesAsync();
                    _response.ResponseCode = 200;
                    _response.Result = id.ToString();
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

        

        public async Task<List<DTO.Task>> GetTasks()
        {
            List<DTO.Task> _response = new List<DTO.Task>();
            var _data = await _context.TblTasks.ToListAsync();
            if (_data != null)
            {
                _response = _mapper.Map<List<TblTask>, List<DTO.Task>>(_data);
            }
            return _response;
        }

        //public async Task<List<DTO.Task>> GetTaskByEmployeeId(string EmployeeId)
        //{
        //    List<Feedback> _response = new List<Feedback>();
        //    var _data = await DTO.Task.Where(f => f.UserId.Equals(UserId)).ToListAsync();
        //    if (_data != null)
        //    {
        //        _response = _mapper.Map<List<TblFeedback>, List<Feedback>>(_data);
        //    }
        //    return _response;
        //}


        public async Task<APIResponse> UpdateTask( DTO.Task task)
        {
            APIResponse response = new APIResponse();
            try
            {
                var _task = await _context.TblTasks.FindAsync(task.Id);
                if (_task != null)
                {
                    _task.FeedbackId= task.FeedbackId;
                    _task.EmployeeId = task.EmployeeId;
                    _task.ManagerId = task.ManagerId;
                    await _context.SaveChangesAsync();
                    response.ResponseCode = 200;
                    response.Result = task.Id.ToString();
                }
                else
                {
                    response.ResponseCode = 404;
                    response.ErrorMessage = "Data not found";
                }

            }
            catch (Exception ex)
            {
                response.ResponseCode = 400;
                response.ErrorMessage = ex.Message;
            }
            return response;
        }

        

        public async Task<List<DTO.Task>> GetTaskByManagerId(string ManagerId)
        {
            List<DTO.Task> _response = new List<DTO.Task>();
            var _data = await AllTask().Where(f => f.ManagerId.Equals(ManagerId)).ToListAsync();
            if (_data != null)
            {
                _response = _mapper.Map<List<TblTask>, List<DTO.Task>>(_data);
            }
            return _response;
        }

        public async Task<List<DTO.Task>> GetTaskByEmployeeId(string EmployeeId)
        {
            List<DTO.Task> _response = new List<DTO.Task>();
            var _data = await AllTask().Where(f => f.EmployeeId.Equals(EmployeeId)).ToListAsync();
            if (_data != null)
            {
                _response = _mapper.Map<List<TblTask>, List<DTO.Task>>(_data);
            }
            return _response;
        }

        

        public async Task<List<DTO.Task>> GetTaskById(int Id)
        {
            List<DTO.Task> _response = new List<DTO.Task>();
            var _data = await AllTask().Where(f => f.Id.Equals(Id)).ToListAsync();
            if (_data != null)
            {
                _response = _mapper.Map<List<TblTask>, List<DTO.Task>>(_data);
            }
            return _response;
        }

        public async Task<List<DTO.Task>> GetTaskByFeedbackId(Guid FeebackId)
        {
            List<DTO.Task> _response = new List<DTO.Task>();
            var _data = await AllTask().Where(f => f.FeedbackId.Equals(FeebackId)).ToListAsync();
            if (_data != null)
            {
                _response = _mapper.Map<List<TblTask>, List<DTO.Task>>(_data);
            }
            return _response;
        }

        public async Task<APIResponse> UpdateTaskStatus(int Id, int Status)
        {
            APIResponse response = new APIResponse();
            try
            {
                var _task = await _context.TblTasks.FindAsync(Id);
                if (_task != null)
                {
                    _task.Status = Status;
                    await _context.SaveChangesAsync();
                    response.ResponseCode = 200;
                    response.Result = Id.ToString();
                }
                else
                {
                    response.ResponseCode = 404;
                    response.ErrorMessage = "Data not found";
                }

            }
            catch (Exception ex)
            {
                response.ResponseCode = 400;
                response.ErrorMessage = ex.Message;
            }
            return response;
        }

        public async Task<APIResponse> UpdateTaskNote(int Id, string Note)
        {
            APIResponse response = new APIResponse();
            try
            {
                var _task = await _context.TblTasks.FindAsync(Id);
                if (_task != null)
                {
                    _task.Note = Note;
                    await _context.SaveChangesAsync();
                    response.ResponseCode = 200;
                    response.Result = Id.ToString();
                }
                else
                {
                    response.ResponseCode = 404;
                    response.ErrorMessage = "Data not found";
                }

            }
            catch (Exception ex)
            {
                response.ResponseCode = 400;
                response.ErrorMessage = ex.Message;
            }
            return response;
        }

        public async Task<APIResponse> UpdateTaskResponse(int Id, string response)
        {
            APIResponse _response = new APIResponse();
            try
            {
                var _task = await _context.TblTasks.FindAsync(Id);
                if (_task != null)
                {
                    _task.Responsed = response;
                    await _context.SaveChangesAsync();
                    _response.ResponseCode = 200;
                    _response.Result = Id.ToString();
                }
                else
                {
                    _response.ResponseCode = 404;
                    _response.ErrorMessage = "Data not found";
                }

            }
            catch (Exception ex)
            {
                _response.ResponseCode = 400;
                _response.ErrorMessage = ex.Message;
            }
            return _response;
        }
    }
    }

