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
        private readonly IUser _user;
        private readonly IConfig _config;

        public TaskRepo(FacilitiesFeedbackManagement_SWP391Context context, IMapper mapper, ILogger<TaskRepo> logger, IUser user, IConfig config)
        {
            _context = context;
            _mapper = mapper;
            _logger = logger;
            _user = user;
            _config = config;
        }

        private IQueryable<TblTask> AllTask() => _context.TblTasks;

        public async Task<List<DTO.Task>> GetTasks()
        {
            _logger.LogInformation("Begin Get Task");
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
            _logger.LogInformation("Begin Get Task by Manager ID");
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
            _logger.LogInformation("Begin Get Task by Employee ID");
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
            _logger.LogInformation("Begin Get Task by Task ID");
            DTO.Task _response = new DTO.Task();
            var _data = await AllTask().Where(f => f.Id.Equals(Id)).FirstOrDefaultAsync();
            if (_data != null)
            {
                _response = _mapper.Map<TblTask, DTO.Task>(_data);
            }
            return _response;
        }

        public async Task<List<DTO.Task>> GetTaskByFeedbackId(Guid FeebackId)
        {
            _logger.LogInformation("Begin Get Task by Task ID");
            List<DTO.Task> _response = new List<DTO.Task>();
            var _data = await AllTask().Where(f => f.FeedbackId.Equals(FeebackId)).ToListAsync();
            if (_data != null)
            {
                _response = _mapper.Map<List<TblTask>, List<DTO.Task>>(_data);
            }
            return _response;
        }

        public async Task<int> CountTaskClosed()
        {
            _logger.LogInformation("Begin Count Task Closed");
            return await AllTask().Where(t => t.Status == (int)Enum.Parse(typeof(DTO.Enums.TaskStatus), "Closed")).CountAsync();
        }


        public async Task<int> CountTaskClosedToday()
        {
            _logger.LogInformation("Begin Count Task Closed Today");
            return await AllTask().Where(t => t.Status == (int)Enum.Parse(typeof(DTO.Enums.TaskStatus), "Closed") && t.DateTime == DateTime.Today).CountAsync();
        }

        public async Task<int> CountTaskDelivered()
        {
            _logger.LogInformation("Begin Count Task Delivered");
            return await AllTask().Where(t => t.Status == (int)Enum.Parse(typeof(DTO.Enums.TaskStatus), "Delivered")).CountAsync();
        }

        public async Task<int> CountTaskDeliveredToday()
        {
            _logger.LogInformation("Begin Count Task Delivered Today");
            return await AllTask().Where(t => t.Status == (int)Enum.Parse(typeof(DTO.Enums.TaskStatus), "Delivered") && t.DateTime == DateTime.Today).CountAsync();
        }

        public async Task<APIResponse> CreateTask(DTO.Task task)
        {
            _logger.LogInformation("Begin Create Task");
            APIResponse response = new APIResponse();
            var feedback = await _context.TblFeedbacks.FirstOrDefaultAsync(x => x.FeedbackId.Equals(task.FeedbackId));
            var employee = await _context.TblUsers.Include(e => e.Cates).FirstOrDefaultAsync(x => x.UserId.ToLower().Equals(task.EmployeeId.ToLower()));

            //if (feedback != null && feedback.Status <= (int)Enum.Parse(typeof(DTO.Enums.FeedbackStatus), "Processing") && employee != null && employee.Cates.Any(c => c.Id.ToLower() == feedback.CateId.ToLower()))
            var item = _context.TblUsers.Include(u => u.TblTaskEmployees).FirstOrDefault(u => u.UserId == task.EmployeeId);

            if (item.TblTaskEmployees.Any(t => t.FeedbackId == task.FeedbackId && t.Status == 0))
            {
                response.ResponseCode = 400;
                response.ErrorMessage = "This employee is handling this feedback!";
            }
            else if (feedback != null && (feedback.Status == (int)Enum.Parse(typeof(DTO.Enums.FeedbackStatus), "Processing") || feedback.Status == (int)Enum.Parse(typeof(DTO.Enums.FeedbackStatus), "Responded")) && employee != null && employee.Cates.Any(c => c.Id.ToLower() == feedback.CateId.ToLower()))
            {
                var config = await _config.ValueOf("MaxTaskDelivered");
                var count = _context.TblTasks.Where(t => t.EmployeeId == task.EmployeeId && t.Status == (int)Enum.Parse(typeof(DTO.Enums.TaskStatus), "Delivered")).Count();
                if (config != null && Convert.ToUInt32(config) > count)
                {
                    TblTask _task = _mapper.Map<DTO.Task, TblTask>(task);
                    await _context.TblTasks.AddAsync(_task);
                    feedback.Status = (int)Enum.Parse(typeof(DTO.Enums.FeedbackStatus), "Processing");
                    await _context.SaveChangesAsync();
                    response.ResponseCode = 200;
                    response.Result = task.Id.ToString();
                }
                else
                {
                    response.ResponseCode = 400;
                    response.ErrorMessage = "Max Tasks!!!!";
                }
            }
            else
            {
                response.ResponseCode = 404;
                response.ErrorMessage = "Feedback is not available or CateId does not match.";
            }
            return response;
        }


        public async Task<APIResponse> TaskClosed(Guid Id)
        {
            _logger.LogInformation("Begin Close Task");
            APIResponse response = new APIResponse();
            var _task = await _context.TblTasks.FirstOrDefaultAsync(t => t.Id == Id);
            if (_task != null && _task.Status == (int)Enum.Parse(typeof(DTO.Enums.TaskStatus), "Responded"))
                response = await UpdateTaskStatus(Id, (int)Enum.Parse(typeof(DTO.Enums.TaskStatus), "Closed"));
            else
            {
                response.ResponseCode = 404;
                response.ErrorMessage = "Task not available";
            }
            return response;
        }


        public async Task<APIResponse> TaskCancel(Guid Id)
        {
            _logger.LogInformation("Begin Cancel Task");
            APIResponse response = new APIResponse();
            var _task = await _context.TblTasks.FirstOrDefaultAsync(t => t.Id == Id);
            if (_task != null && _task.Status != (int)Enum.Parse(typeof(DTO.Enums.TaskStatus), "Closed"))
                response = await UpdateTaskStatus(Id, (int)Enum.Parse(typeof(DTO.Enums.TaskStatus), "Cancelled"));
            else
            {
                response.ResponseCode = 404;
                response.ErrorMessage = "Task not available";
            }
            return response;
        }

        public async Task<APIResponse> UpdateTaskNote(Guid Id, string Note)
        {
            _logger.LogInformation("Begin Update Task");
            APIResponse response = new APIResponse();
            try
            {
                var _task = await _context.TblTasks.FindAsync(Id);
                if (_task != null)
                {
                    _task.Note = Note;
                    _task.Status = (int)Enum.Parse(typeof(DTO.Enums.TaskStatus), "Delivered");
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
            _logger.LogInformation("Begin Response Task");
            APIResponse _response = new APIResponse();
            try
            {
                var _task = await _context.TblTasks.FindAsync(Id);
                if (_task != null && _task.Status == (int)Enum.Parse(typeof(DTO.Enums.TaskStatus), "Delivered"))
                {
                    _task.Responsed = response;
                    _task.Status = (int)Enum.Parse(typeof(DTO.Enums.TaskStatus), "Responded");
                    var fb = await _context.TblFeedbacks.FirstOrDefaultAsync(t => t.FeedbackId == _task.FeedbackId);
                    var list = _context.TblTasks.Where(t => t.FeedbackId == _task.FeedbackId).ToList();

                    if (list != null)
                    {
                        var flag = true;
                        foreach (var item in list)
                        {
                            if (item.Status != (int)Enum.Parse(typeof(DTO.Enums.TaskStatus), "Responded") && item.Status != (int)Enum.Parse(typeof(DTO.Enums.TaskStatus), "Expired") && item.Status != (int)Enum.Parse(typeof(DTO.Enums.TaskStatus), "Cancelled"))
                            {
                                flag = false;
                            }
                        }
                        if (flag)
                        {
                            fb.Status = (int)Enum.Parse(typeof(DTO.Enums.FeedbackStatus), "Responded");
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
                _response.ErrorMessage = "Response failed!!";
                _logger.LogError(ex.Message, ex);
            }
            return _response;
        }

        public async Task<APIResponse> DeleteTask(Guid id)
        {
            _logger.LogInformation("Begin Delete Task");
            APIResponse response = new APIResponse();
            var _task = await _context.TblTasks.FirstOrDefaultAsync(t => t.Id == id);
            if (_task != null && _task.Status == (int)Enum.Parse(typeof(DTO.Enums.TaskStatus), "Delivered"))
                response = await UpdateTaskStatus(id, (int)Enum.Parse(typeof(DTO.Enums.TaskStatus), "Removed"));
            else
            {
                response.ResponseCode = 404;
                response.ErrorMessage = "Task not available";
            }
            return response;
        }

        public async Task<APIResponse> UpdateTaskStatus(Guid Id, int status)
        {
            _logger.LogInformation("Begin Update Status of Task");
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

