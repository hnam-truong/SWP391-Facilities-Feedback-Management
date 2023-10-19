using Group4.FacilitiesReport.DTO;
using Group4.FacilitiesReport.Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Group4.FacilitiesReport.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TaskController : ControllerBase
    {
        private readonly ITasks _tasks;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public TaskController(ITasks tasks, IWebHostEnvironment webHostEnvironment)
        {
            _tasks = tasks;
            _webHostEnvironment = webHostEnvironment;
        }

        [HttpGet("GetAll")]
        public async Task<IActionResult> GetTasks()
        {
            var data = await _tasks.GetTasks();
            if (data == null)
            {
                return NotFound();
            }
            return Ok(data);
        }

        [HttpGet("/TaskId")]
        public async Task<IActionResult> GetTaskByTaskId(int TaskId)
        {
            var user = await _tasks.GetTaskById(TaskId);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }

        [HttpGet("/ManagerId")]
        public async Task<IActionResult> GetTaskByManagerId(string ManagerId)
        {
            var user = await _tasks.GetTaskByManagerId(ManagerId);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }

        [HttpGet("/EmployeeId")]
        public async Task<IActionResult> GetTaskByEmployee(string EmployeeId)
        {
            var user = await _tasks.GetTaskByEmployeeId(EmployeeId);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }

        [HttpGet("/FeedbackId")]
        public async Task<IActionResult> GetTaskByfeedback(Guid FeedbackId)
        {
            var user = await _tasks.GetTaskByFeedbackId(FeedbackId);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }


        [HttpPost("Create")]
        public async Task<IActionResult> CreateTask(Guid FeedbackId, string EmployeeId, string ManagerId,string ImgUrl, string Note)
        {
            var task = await _tasks.CreateTask(new DTO.Task
            {
                FeedbackId = FeedbackId,
                EmployeeId = EmployeeId,
                ManagerId = ManagerId,
                ImgConfirmationUrl = ImgUrl,
                DateTime = DateTime.Now,
                Note = Note,
            });
            return Ok(task);
        }
        
        [HttpPut("UpdateStatus")]
        public async Task<IActionResult> UpdatetaskStatus(int Id, string Status)
        {
            Enum.TryParse(Status, out DTO.Enums.TaskStatus enumValue);
            var task = await _tasks.UpdateTaskStatus(Id, (int)enumValue);
            return Ok(task);
        }

        [HttpPut("UpdateTaskNote")]
        public async Task<IActionResult> UpdateTaskNote(int Id, string Note)
        {
            var task = await _tasks.UpdateTaskNote(Id, Note);
            return Ok(task);
        }
        [HttpPut("UpdateTaskResponse")]
        public async Task<IActionResult> UpdateTaskResponse(int Id, string Response)
        {
            var task = await _tasks.UpdateTaskResponse(Id, Response);
            return Ok(task);
        }

        [HttpDelete("Remove")]
        public async Task<IActionResult> Remove(int Id)
        {
            return Ok(await _tasks.DeleteTask(Id));
        }

        
        
    }
}
