using Group4.FacilitiesReport.DTO;
using Group4.FacilitiesReport.Interface;
using Microsoft.AspNetCore.Mvc;

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
        [HttpGet("GetFile")]
        public async Task<IActionResult> GetFile(Guid feedbackId)
        {
            List<string> fileUrl = new List<string>();
            string hostUrl = $"{this.Request.Scheme}://{this.Request.Host}{this.Request.PathBase}";
            try
            {
                string filePath = GetFilePath(feedbackId);
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
                            string url = hostUrl + "/Uploading/Feedback/" + feedbackId + "/" + filename;
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
            string hostUrl = $"{this.Request.Scheme}://{this.Request.Host}{this.Request.PathBase}";
            try
            {
                string filePath = GetFilePath(feedbackId);
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
                            string url = hostUrl + "/Uploading/Feedback/" + feedbackId + "/" + filename;
                            MemoryStream stream = new MemoryStream();
                            using (FileStream fileStream = new FileStream(dir, FileMode.Open))
                            {
                                await fileStream.CopyToAsync(stream);
                            }
                            stream.Position = 0;
                            return File(stream, "Multipart/FromForm");
                        }

                        else
                        {
                            return NotFound();
                        }
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
            var feedback = await this._ifeedback.CreateFeedback(new Feedback
            {
                FeedbackId = feedbackId,
                UserId = userId,
                Title = title,
                Description = description,
                CateId = cateId,
                LocationId = locatoinId,
                Notify = 0,
                DataUrl = GetFilePath(feedbackId),
                DateTime = DateTime.Now
            });
            response.ResponseCode = 200;
            response.Result = "Feedback " + feedbackId + " create Successful!\n" +
                passcount + " File(s) uploaded.\n" +
                errorcount + " File(s) fail.";
            return Ok(response);

        }

        [HttpPut("Update")]
        public async Task<IActionResult> UpdateFeedback(Guid feedbackId, string userId, string title, string description, string cateId, string locatoinId)
        {
            var feedback = await this._ifeedback.UpdateFeedback(new Feedback
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

        [HttpPut("Notify")]
        public async Task<IActionResult> NotifyFeedback(Guid feedbackId)
        {
            var feedback = await this._ifeedback.NotifyFeedback(feedbackId);
            return Ok(feedback);
        }

        [HttpPut("UpdateStatus")]
        public async Task<IActionResult> UpdateFeedbackStatus(Guid feedbackId, string status)
        {
            Enum.TryParse(status, out DTO.Enums.FeedbackStatus enumValue);
            var feedback = await this._ifeedback.UpdateFeedbackStatus(feedbackId, (int)enumValue);
            return Ok(feedback);
        }

        [HttpPut("ResponseFeedback")]
        public async Task<IActionResult> ResponseFeedback(Guid feedbackId, string description)
        {
            var feedback = await this._ifeedback.FeedbackResponse(feedbackId, description);
            return Ok(feedback);
        }
        [HttpDelete("RemoveFeedback/{feedbackId}")]
        public async Task<IActionResult> RemoveFeedback(Guid feedbackId)
        {
            return Ok(await _ifeedback.RemoveFeedback(feedbackId));
        }
        [NonAction]
        private string GetFilePath(Guid feedbackId)
        {
            return this._webHostEnvironment.WebRootPath + "\\Uploading\\Feedback\\" + feedbackId.ToString();
        }
    }
}
