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
            var _data = await AllTask().Include(u => u.Manager).Where(f => f.EmployeeId.Equals(EmployeeId)).ToListAsync();
            if (_data != null)
            {
                _response = _mapper.Map<List<TblTask>, List<DTO.Task>>(_data);
            }
            return _response;
        }

        public async Task<DTO.Task> GetTaskById(Guid Id)
        {
            DTO.Task _response = new DTO.Task();
            var _data = await AllTask().Where(f => f.Id.Equals(Id)).FirstOrDefaultAsync();
            if (_data != null)
            {
                _response = _mapper.Map<TblTask,DTO.Task>(_data);
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

        public async Task<APIResponse> CreateTask(DTO.Task task)
        {
            APIResponse response = new APIResponse();
            var data = await _context.TblFeedbacks.FirstOrDefaultAsync(x => x.FeedbackId.Equals(task.FeedbackId));
            if (data != null && data.Status <= 1)
            {
                TblTask _task = _mapper.Map<DTO.Task, TblTask>(task);
                await _context.TblTasks.AddAsync(_task);
                data.Status = 1;
                await _context.SaveChangesAsync();

                response.ResponseCode = 200;
                response.Result = task.Id.ToString();
            }
            else
            {
                response.ResponseCode = 400;
                response.ErrorMessage = "Feedback is not Available";
            }
            return response;
        }


        public async Task<APIResponse> TaskClosed(Guid Id)
        {
            APIResponse response = new APIResponse();
            var _task = await _context.TblTasks.FirstOrDefaultAsync(t=>t.Id==Id);
            if(_task!=null&&_task.Status==1)
            response= await UpdateTaskStatus(Id, 2);
            else
            {
                response.ResponseCode = 404;
                response.ErrorMessage = "Task not available";
            }
            return response;
        }


        public async Task<APIResponse> TaskCancel(Guid Id)
        {
            APIResponse response = new APIResponse();
            var _task = await _context.TblTasks.FirstOrDefaultAsync(t => t.Id == Id);
            if (_task != null && _task.Status != 2)
                response = await UpdateTaskStatus(Id, 3);
            else
            {
                response.ResponseCode = 404;
                response.ErrorMessage = "Task not available";
            }
            return response;
        }

        public async Task<APIResponse> UpdateTaskNote(Guid Id, string Note)
        {
            APIResponse response = new APIResponse();
            try
            {
                var _task = await _context.TblTasks.FindAsync(Id);
                if (_task != null)
                {
                    _task.Note = Note;
                    _task.Status = 0;
                    await _context.SaveChangesAsync();
                    response.ResponseCode = 200;
                    response.Result = Id.ToString();
                }
                else
                {
                    response.ResponseCode = 404;
                    response.ErrorMessage = "Task not available";
                }

            }
            catch (Exception ex)
            {
                response.ResponseCode = 400;
                response.ErrorMessage = ex.Message;
            }
            return response;
        }

        public async Task<APIResponse> UpdateTaskResponse(Guid Id, string response)
        {

            APIResponse _response = new APIResponse();
            try
            {
                var _task = await _context.TblTasks.FindAsync(Id);
                if (_task != null && _task.Status == 0)
                {
                    _task.Responsed = response;
                    _task.Status = 1;
                    var fb = await _context.TblFeedbacks.FirstOrDefaultAsync(t => t.FeedbackId == _task.FeedbackId);
                    var list = _context.TblTasks.Where(t => t.FeedbackId == _task.FeedbackId).ToList();

                    if (list != null)
                    {
                        var flag = true;
                        foreach (var item in list)
                        {
                            if (item.Status != 1)
                            {
                               flag =false;
                            }
                        }
                        if (flag) {
                            fb.Status = 2;
                        }
                        await _context.SaveChangesAsync();
                    }
                    _response.ResponseCode = 200;
                    _response.Result = Id.ToString();
                }
                else
                {
                    _response.ResponseCode = 404;
                    _response.ErrorMessage = "Task not available";
                }

            }
            catch (Exception ex)
            {
                _response.ResponseCode = 400;
                _response.ErrorMessage = ex.Message;
            }
            return _response;
        }

        public async Task<APIResponse> DeleteTask(Guid id)
        {
            APIResponse response = new APIResponse();
            var _task = await _context.TblTasks.FirstOrDefaultAsync(t => t.Id == id);
            if (_task != null && _task.Status == 0)
                response = await UpdateTaskStatus(id, 4);
            else
            {
                response.ResponseCode = 404;
                response.ErrorMessage = "Task not available";
            }
            return response;
        }

        public async Task<APIResponse> UpdateTaskStatus(Guid Id, int status)
        {
            APIResponse response = new APIResponse();
            try
            {
                var _task = await _context.TblTasks.FindAsync(Id);
                if (_task != null)
                {
                    _task.Status = status;
                    await _context.SaveChangesAsync();
                    response.ResponseCode = 200;
                    response.Result = Id.ToString();
                }
                else
                {
                    response.ResponseCode = 404;
                    response.ErrorMessage = "Task not available";
                }

            }
            catch (Exception ex)
            {
                response.ResponseCode = 400;
                response.ErrorMessage = ex.Message;
            }
            return response;
        }

    }
}

