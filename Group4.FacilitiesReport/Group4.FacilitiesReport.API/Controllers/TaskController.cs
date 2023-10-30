﻿using Group4.FacilitiesReport.DTO;
using Group4.FacilitiesReport.Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.IO.Compression;

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
        public async Task<IActionResult> GetTaskByTaskId(Guid TaskId)
        {
            var task = await _tasks.GetTaskById(TaskId);
            if (task == null)
            {
                return NotFound();
            }
            return Ok(task);
        }

        [HttpGet("/ManagerId")]
        public async Task<IActionResult> GetTaskByManagerId(string ManagerId)
        {
            var task = await _tasks.GetTaskByManagerId(ManagerId);
            if (task == null)
            {
                return NotFound();
            }
            return Ok(task);
        }

        [HttpGet("/EmployeeId")]
        public async Task<IActionResult> GetTaskByEmployee(string EmployeeId)
        {
            var task = await _tasks.GetTaskByEmployeeId(EmployeeId);
            if (task == null)
            {
                return NotFound();
            }
            return Ok(task);
        }

        [HttpGet("/FeedbackId")]
        public async Task<IActionResult> GetTaskByfeedback(Guid FeedbackId)
        {
            var task = await _tasks.GetTaskByFeedbackId(FeedbackId);
            if (task == null)
            {
                return NotFound();
            }
            return Ok(task);
        }

        [HttpGet("GetFile")]
        public async Task<IActionResult> GetFile(Guid Id)
        {
            List<string> fileUrl = new List<string>();
            string hostUrl = $"{this.Request.Scheme}://{this.Request.Host}{this.Request.PathBase}";
            try
            {
                string filePath = GetFilePath(Id);
                if (System.IO.Directory.Exists(filePath))
                {
                    DirectoryInfo fileInfo = new DirectoryInfo(filePath);
                    FileInfo[] fileInfos = fileInfo.GetFiles();
                    foreach (FileInfo f in fileInfos)
                    {
                        string filename = fileInfo.Name;
                        string dir = filePath + "\\" + filename;
                        if (System.IO.File.Exists(dir))
                        {
                            string url = hostUrl + "/Uploading/Task/" + Id + "/" + filename;
                            fileUrl.Add(url);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
            }
            return Ok(fileUrl);
        }

        [HttpGet("Download")]
        public async Task<IActionResult> download(Guid feedbackId)
        {
            try
            {
                string filePath = GetFilePath(feedbackId);
                if (System.IO.Directory.Exists(filePath))
                {
                    DirectoryInfo fileInfo = new DirectoryInfo(filePath);
                    FileInfo[] fileInfos = fileInfo.GetFiles();
                    using (var zipStream = new MemoryStream())
                    {
                        using (var archive = new ZipArchive(zipStream, ZipArchiveMode.Create, true))
                        {
                            foreach (var file in fileInfos)
                            {
                                var zipEntry = archive.CreateEntry(file.Name);
                                using (var entryStream = zipEntry.Open())
                                {
                                    var fileDir = filePath + "\\" + file.Name;
                                    await entryStream.CopyToAsync(zipStream);
                                }
                            }
                        }
                        zipStream.Position = 0;

                        return File(zipStream, "application/zip", "TaskFiles.zip");
                    }
                }
                return NotFound();
            }
            catch (Exception ex)
            {
                return NotFound(ex);
            }
        }

        [NonAction]
        private string GetContentType(string fileExtension)
        {
            switch (fileExtension.ToLower())
            {
                case ".png":
                    return "image/png";
                case ".jpg":
                case ".jpeg":
                    return "image/jpeg";
                case ".gif":
                    return "image/gif";
                case "mp4":
                    return "video/mp4";
                case "quicktime":
                    return "video/quicktime";
                case "x-ms-wmv":
                    return "x-ms-wmv";
                case "x-msvideo":
                    return "video/x-msvideo";
                case "x-flv":
                    return "video/x-flv";
                case "webm":
                    return "video/webm";
                default:
                    return "application/octet-stream";  // Fallback to binary data
            }
        }

        [HttpPost("/Create")]
        public async Task<IActionResult> CreateTask(Guid FeedbackId, string EmployeeId, string ManagerId, string Note, [FromForm] IFormFileCollection fileCollection)
        {
            int passcount = 0;
            int errorcount = 0;
            Guid Id = Guid.NewGuid();
            APIResponse response = new APIResponse();
            try
            {
                string FilePath = GetFilePath(Id);
                if (!System.IO.File.Exists(FilePath))
                {
                    System.IO.Directory.CreateDirectory(FilePath);
                }
                foreach (var file in fileCollection)
                {
                    string fileDir = FilePath + "\\" + file.FileName;
                    if (System.IO.File.Exists(fileDir))
                    {
                        System.IO.Directory.Delete(fileDir);
                    }
                    using (FileStream stream = System.IO.File.Create(fileDir))
                    {
                        await file.CopyToAsync(stream);
                        passcount++;
                    }
                }

                response = await _tasks.CreateTask(new DTO.Task
                {
                    Id = Id,
                    FeedbackId = FeedbackId,
                    EmployeeId = EmployeeId,
                    ManagerId = ManagerId,
                    ImgConfirmationUrl = GetFilePath(Id),
                    DateTime = DateTime.Now,
                    Note = Note,
                });

                if (response.ResponseCode == 200)
                {
                    response.Result += " " +
                        passcount + " File(s) uploaded. " +
                        errorcount + " File(s) fail.";
                }
            }
            catch (Exception ex)
            {
                errorcount++;
                response.ResponseCode = 400;
                response.ErrorMessage = ex.Message;
            }

            return Ok(response);
        }

        [HttpPut("Cancel")]
        public async Task<IActionResult> TaskCancel(Guid Id) { 
     
            var task=await _tasks.GetTaskById(Id);
            if (task != null&& task.Status=="Responded") return Ok(await _tasks.UpdateTaskStatus(Id, 3));
            else return NotFound();
        
        }
        [HttpPut("Closed")]
        public async Task<IActionResult> TaskClosed(Guid Id)
        {
            var task = await _tasks.GetTaskById(Id);
            if (task != null && task.Status == "Responded") { return Ok(await _tasks.UpdateTaskStatus(Id, 2)); }
            else
                return NotFound();
        }
        [HttpPut("Delivered")]
        public async Task<IActionResult> TaskDelivered(Guid Id)
        {
            var task = await _tasks.GetTaskById(Id);
            if (task != null && task.Status == "Responded") { return Ok(await _tasks.UpdateTaskStatus(Id, 0)); }
            else
                return NotFound();
        }

        [HttpPut("UpdateTaskNote")]
        public async Task<IActionResult> UpdateTaskNote(Guid Id, string Note)
        {
            var task = await _tasks.UpdateTaskNote(Id, Note);
            return Ok(task);
        }
        [HttpPut("UpdateTaskResponse")]
        public async Task<IActionResult> UpdateTaskResponse(Guid Id, string Response)
        {
            var task = await _tasks.UpdateTaskResponse(Id, Response);
            return Ok(task);
        }

        [HttpDelete("Remove")]
        public async Task<IActionResult> Remove(Guid Id)
        {
            return Ok(await _tasks.DeleteTask(Id));
        }

        private string GetFilePath(Guid Id)
        {
            return this._webHostEnvironment.WebRootPath + "\\Uploading\\Task\\" + Id.ToString();
        }

    }
}