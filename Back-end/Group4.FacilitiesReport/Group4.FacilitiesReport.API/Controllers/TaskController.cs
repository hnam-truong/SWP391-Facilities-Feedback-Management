using Group4.FacilitiesReport.DTO;
using Group4.FacilitiesReport.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.IO.Compression;
using System.Threading.Tasks;

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
        //[Authorize("Manager")]
        [HttpGet("GetAllTask")]
        public async Task<IActionResult> GetTasks()
        {
            var data = await _tasks.GetTasks();
            if (data == null)
            {
                return NotFound();
            }
            return Ok(data);
        }
        //[Authorize("Manager")]
        [HttpGet("TaskID/{TaskId}")]
        public async Task<IActionResult> GetTaskByTaskId(Guid TaskId)
        {
            var task = await _tasks.GetTaskById(TaskId);
            if (task == null)
            {
                return NotFound();
            }
            return Ok(task);
        }
        //[Authorize("Manager")]
        [HttpGet("ManagerID/{ManagerId}")]
        public async Task<IActionResult> GetTaskByManagerId(string ManagerId)
        {
            var task = await _tasks.GetTaskByManagerId(ManagerId);
            if (task == null)
            {
                return NotFound();
            }
            return Ok(task);
        }
        //[Authorize("Manager, Task Employee")]
        [HttpGet("EmployeeID/{EmployeeId}")]
        public async Task<IActionResult> GetTaskByEmployee(string EmployeeId)
        {
            var task = await _tasks.GetTaskByEmployeeId(EmployeeId);
            if (task == null)
            {
                return NotFound();
            }
            return Ok(task);
        }
        //[Authorize("Manager")]
        [HttpGet("FeedbackID/{FeedbackId}")]
        public async Task<IActionResult> GetTaskByfeedback(Guid FeedbackId)
        {
            var task = await _tasks.GetTaskByFeedbackId(FeedbackId);
            if (task == null)
            {
                return NotFound();
            }
            return Ok(task);
        }
        [HttpGet("CountTaskClosed")]
        public async Task<IActionResult> CountTaskClosed()
        {
            int count = await _tasks.CountTaskClosed();
            return Ok(count);
        }

        [HttpGet("CountTaskClosedToday")]
        public async Task<IActionResult> CountTaskClosedToday()
        {
            int count = await _tasks.CountTaskClosedToday();
            return Ok(count);
        }
        [HttpGet("CountTaskDelivered")]
        public async Task<IActionResult> CountTaskDelivered()
        {
            int count = await _tasks.CountTaskDelivered();
            return Ok(count);
        }
        [HttpGet("CountTaskDeliveredToday")]
        public async Task<IActionResult> CountTaskDeliveredToday()
        {
            int count = await _tasks.CountTaskDeliveredToday();
            return Ok(count);
        }


        [HttpGet("GetFile")]
        public async Task<IActionResult> GetFile(Guid Id)
        {
            List<string> fileUrl = new List<string>();
            string hostUrl = $"{this.Request.Scheme}://{this.Request.Host}//{this.Request.PathBase}";
            try
            {
                string filePath = GetFilePath(Id);
                if (System.IO.Directory.Exists(filePath))
                {
                    DirectoryInfo fileInfo = new DirectoryInfo(filePath);
                    FileInfo[] fileInfos = fileInfo.GetFiles();
                    foreach (FileInfo f in fileInfos)
                    {
                        string filename = f.Name;
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
        public async Task<IActionResult> download(Guid taskId)
        {
            try
            {
                string filePath = GetFilePath(taskId);
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
        
        //[Authorize("Manager")]
        [HttpPost("/CreateTask")]
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
        //[Authorize("Manager")]
        [HttpPut("CancelTask")]
        public async Task<IActionResult> TaskCancel(Guid Id) { 
     
            var task=await _tasks.GetTaskById(Id);
            if (task != null&& task.Status=="Responded") return Ok(await _tasks.UpdateTaskStatus(Id, 3));
            else return NotFound();
        
        }
        //[Authorize("Manager")]
        [HttpPut("CloseTask")]
        public async Task<IActionResult> TaskClosed(Guid Id)
        {
            var task = await _tasks.GetTaskById(Id);
            if (task != null && task.Status == "Responded") { return Ok(await _tasks.UpdateTaskStatus(Id, 2)); }
            else
                return NotFound();
        }
        //[Authorize("Manager")]
        [HttpPut("DeliveredTask")]
        public async Task<IActionResult> TaskDelivered(Guid Id)
        {
            var task = await _tasks.GetTaskById(Id);
            if (task != null && task.Status == "Responded") { return Ok(await _tasks.UpdateTaskStatus(Id, 0)); }
            else
                return NotFound();
        }
        //[Authorize("Manager")]
        [HttpPut("UpdateTaskNote")]
        public async Task<IActionResult> UpdateTaskNote(Guid Id, string Note)
        {
            var task = await _tasks.UpdateTaskNote(Id, Note);
            return Ok(task);
        }
        //[Authorize("Task Employee")]
        [HttpPut("UpdateTaskResponse")]
        public async Task<IActionResult> UpdateTaskResponse(Guid Id, string Response, IFormFileCollection fileCollection)
        {
            APIResponse response = new APIResponse();
            int passcount = 0;
            int errorcount = 0;
            try
            {
                string FilePath = GetFilePath(Id);
                if (!System.IO.File.Exists(FilePath))
                {
                    System.IO.Directory.CreateDirectory(FilePath);
                }
                else
                {
                    System.IO.Directory.Delete(FilePath, true);
                    System.IO.Directory.CreateDirectory(FilePath);
                }
                foreach (var file in fileCollection)
                {
                    string fileDir = FilePath + "\\" + file.FileName;
                        using (FileStream stream = System.IO.File.Create(fileDir))
                        {
                            await file.CopyToAsync(stream);
                            passcount++;
                        }                    
                }
            }
            catch (Exception ex)
            {
                errorcount++;
                response.ErrorMessage = ex.Message;
            }
            var task = await _tasks.UpdateTaskResponse(Id, Response);
            response.ResponseCode = task.ResponseCode;
            response.ErrorMessage = task.ErrorMessage;
            response.Result = "Task " + task + " update Successful!\n" +
                passcount + " File(s) uploaded.\n" +
                errorcount + " File(s) fail.";
            return Ok(response);
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
