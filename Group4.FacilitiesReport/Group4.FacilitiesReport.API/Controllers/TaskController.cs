﻿using Group4.FacilitiesReport.DTO;
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
        public async Task<IActionResult> Create(int Id, Guid feedbackId, string EmployeeId, string ManagerId)
        {
            var task = await _tasks.CreateTask(new DTO.Task
            {
                Id = Id,
                FeedbackId = feedbackId,
                EmployeeId = EmployeeId,
                ManagerId = ManagerId
            });
            return Ok(task);
        }
        [HttpPut("Update")]
        public async Task<IActionResult> UpdateTask(int Id,Guid feedbackId, string EmployeeId, string ManagerId)
        {
            var task = await _tasks.UpdateTask(new DTO.Task
            {
                Id=Id,
                FeedbackId = feedbackId,
                EmployeeId = EmployeeId,
                ManagerId = ManagerId
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

        [HttpDelete("Remove")]
        public async Task<IActionResult> Remove(int Id)
        {
            return Ok(await _tasks.DeleteTask(Id));
        }

        //[HttpPost("Create")]
        //public async Task<IActionResult> CreateTask(int Id,Guid FeedbackId, string EmployeeId, string ManagerId)
        //{
        //    var task = await _tasks.CreateTask(new DTO.Task
        //    {
        //        Id = Id,
        //        FeedbackId = FeedbackId,
        //        EmployeeId =EmployeeId,
        //        ManagerId = ManagerId,
        //    });
        //    return Ok(task);
        //}
        
    }
}
