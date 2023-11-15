using Group4.FacilitiesReport.DTO;
using Group4.FacilitiesReport.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IO.Compression;

namespace Group4.FacilitiesReport.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize]
    public class FeedbacksController : ControllerBase
    {
        private readonly IFeedback _ifeedback;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public FeedbacksController(IFeedback ifeedback, IWebHostEnvironment webHostEnvironment)
        {
            _ifeedback = ifeedback;
            _webHostEnvironment = webHostEnvironment;
        }
        //[Authorize("Manager")]
        [HttpGet("AllFeedbacks")]
        public async Task<IActionResult> GetAllFeedback()
        {
            var feedbacks = await this._ifeedback.GetAllFeedBack();
            if (feedbacks == null)
            {
                return NotFound();
            }
            return Ok(feedbacks);
        }
        //[Authorize("Manager")]
        [HttpGet("ByStatus")]
        public async Task<IActionResult> GetFeedbackByStatus(string status)
        {
            var feedbacks = await this._ifeedback.GetFeedbackByStatus((int)Enum.Parse(typeof(DTO.Enums.FeedbackStatus), status));
            if (feedbacks == null)
            {
                return NotFound();
            }
            return Ok(feedbacks);
        }
        //[Authorize("Manager, Student, Lecturer, Casual Employee")]
        [HttpGet("User/{UserId}")]
        public async Task<IActionResult> GetFeedbackByUserId(string UserId)
        {
            var feedbacks = await this._ifeedback.GetFeedbackByUserId(UserId);
            if (feedbacks == null)
            {
                return NotFound();
            }
            return Ok(feedbacks);
        }
        //[Authorize("Manager")]
        [HttpGet("Id/{feedbackId}")]
        public async Task<IActionResult> GetFeedback(Guid feedbackId)
        {
            var feedbacks = await this._ifeedback.GetFeedback(feedbackId);
            if (feedbacks == null)
            {
                return NotFound();
            }
            return Ok(feedbacks);
        }
        //[Authorize("Manager")]
        [HttpGet("Cate/{CateId}")]
        public async Task<IActionResult> GetFeedbackByCate(string CateId)
        {
            var feedbacks = await this._ifeedback.GetFeedbacksByCate(CateId);
            if (feedbacks == null)
            {
                return NotFound();
            }
            return Ok(feedbacks);
        }

        //[Authorize("Manager")]
        [HttpGet("Count")]
        public async Task<IActionResult> CountFeedback(string beginDate, string endDate)
        {
            int count = await this._ifeedback.CountFeedbackByDate(
                DateTime.ParseExact(beginDate, "dd-MM-yyyy",
                                      System.Globalization.CultureInfo.InvariantCulture),
                DateTime.ParseExact(endDate, "dd-MM-yyyy",
                                      System.Globalization.CultureInfo.InvariantCulture));
            return Ok(count);
        }
        [HttpGet("CountFeedbackClosedToday")] 
        public async Task<IActionResult> CountFeedbackClosedToday()
        {
            int count = await this._ifeedback.CountFeedbackClosedByDate();
                
            return Ok(count);
        }
        [HttpGet("CountFeedbackClosed")]
        public async Task<IActionResult> CountTaskClosed()
        {
            int count = await _ifeedback.CountFeedbackClosed();
            return Ok(count);
        }
        //[Authorize("Manager")]
        [HttpGet("CountLastWeek")]
        public async Task<IActionResult> CountWeek()
        {
            var count = await this._ifeedback.RecentGraphFeedback();
            return Ok(count);
        }
        //[Authorize("Manager")]
        [HttpGet("CountLastYear")]
        public async Task<IActionResult> CountYear()
        {
            var count = await this._ifeedback.MonthlyGraphFeedback();
            return Ok(count);
        }
        [HttpGet("CountUser")]
        public async Task<IActionResult> CountUser()
        {
            var count = await this._ifeedback.RecentUserCreateFeedback();
            return Ok(count);
        }
        [HttpGet("GetFile")]
        public async Task<IActionResult> GetFile(Guid feedbackId)
        {
            List<string> fileUrl = new List<string>();
            string hostUrl = $"{this.Request.Scheme}://{this.Request.Host}//{this.Request.PathBase}";
            try
            {
                string filePath = GetFilePath(feedbackId);
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
                            string url = hostUrl + "/Uploading/Feedback/" + feedbackId + "/" + filename;
                            fileUrl.Add(url);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
            return Ok(fileUrl);
        }


        [HttpGet("Download")]
        public async Task<IActionResult> Download(Guid feedbackId)
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

                        return File(zipStream, "application/zip", "FeedbackFiles.zip");
                    }
                }
                return NotFound();
            }
            catch (Exception ex)
            {
                return NotFound(ex);
            }
        }
        //[Authorize("Student, Lecturer, Casual Employee")]
        [HttpPost("Create")]
        public async Task<IActionResult> CreateFeedback(string userId, string title, string description, string cateId, string locatoinId, [FromForm] IFormFileCollection fileCollection)
        {
            APIResponse response = new APIResponse();
            int passcount = 0;
            int errorcount = 0;
            Guid feedbackId = Guid.NewGuid();
            try
            {
                string FilePath = GetFilePath(feedbackId);
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
            }
            catch (Exception ex)
            {
                errorcount++;
                response.ErrorMessage = ex.Message;
            }
            var msg = await this._ifeedback.CreateFeedback(new Feedback
            {
                FeedbackId = feedbackId,
                UserId = userId,
                Title = title,
                Description = description,
                CateId = cateId,
                LocationId = locatoinId,
                Notify = 0,
                DataUrl = GetFilePath(feedbackId),
                DateTime = DateTime.Now,
                Status = "Waiting",
            });
            response.ResponseCode =msg.ResponseCode;
            response.ErrorMessage = msg.ErrorMessage;
            response.Result = "Feedback " + feedbackId + " create Successful!\n" +
                passcount + " File(s) uploaded.\n" +
                errorcount + " File(s) fail.";
            return Ok(response);

        }
        //[Authorize("Student, Lecturer, Casual Employee")]
        [HttpPut("Update")]
        public async Task<IActionResult> UpdateFeedback(Guid feedbackId, string userId, string title, string description, string cateId, string locatoinId)
        {
            var feedback = await this._ifeedback.UpdateFeedback(new FeedbackUpdatableObject
            {
                FeedbackId = feedbackId,
                UserId = userId,
                Title = title,
                Description = description,
                CateId = cateId,
                LocationId = locatoinId,
            });
            return Ok(feedback);
        }
        //[Authorize("Student, Lecturer, Casual Employee, Manager")]
        [HttpPut("Notify")]
        public async Task<IActionResult> NotifyFeedback(Guid feedbackId)
        {
            var feedback = await this._ifeedback.NotifyFeedback(feedbackId);
            return Ok(feedback);
        }

        //[Authorize("Task Employee, Manager")]
        [HttpPut("RespondFeedback")]
        public async Task<IActionResult> ResponseFeedback(Guid feedbackId, string description)
        {
            var feedback = await this._ifeedback.RespondFeedback(feedbackId, description);
            return Ok(feedback);
        }
        //[Authorize("Manager")]
        [HttpPut("CloseFeedback")]
        public async Task<IActionResult> CloseFeedback(Guid feedbackId, string response)
        {

            return Ok(await _ifeedback.CloseFeedback(feedbackId, response));
        }
        //[Authorize("Manager")]
        [HttpPut("AcceptFeedback")]
        public async Task<IActionResult> AcceptFeedback(Guid feedbackId, string response)
        {
            return Ok(await _ifeedback.AcceptFeedback(feedbackId, response));
        }
        //[Authorize("Manager")]
        [HttpPut("CancelFeedback")]
        public async Task<IActionResult> CancelFeedback(Guid feedbackId, string response)
        {
            return Ok(await _ifeedback.CancelAcceptFeedback(feedbackId, response));
        }
        //[Authorize("Manager")]
        [HttpPut("RejectFeedback")]
        public async Task<IActionResult> RejectFeedback(Guid feedbackId, string response)
        {
            return Ok(await _ifeedback.RejectFeedback(feedbackId, response));
        }
        //[Authorize("Manager")]
        [HttpPut("UndoFeedback")]
        public async Task<IActionResult> UndoRejectFeedback(Guid feedbackId, string response)
        {
            return Ok(await _ifeedback.UndoRejectFeedback(feedbackId, response));
        }


        [NonAction]
        private string GetFilePath(Guid feedbackId)
        {
            return this._webHostEnvironment.WebRootPath + "\\Uploading\\Feedback\\" + feedbackId.ToString();
        }
        [HttpDelete("RemoveFeedback/{feedbackId}")]
        public async Task<IActionResult> RemoveFeedback(Guid feedbackId)
        {

            return Ok(await _ifeedback.RemoveFeedback(feedbackId));
        }

    }
}