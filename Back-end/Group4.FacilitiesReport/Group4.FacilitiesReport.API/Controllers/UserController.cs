using AutoMapper;
using Group4.FacilitiesReport.DTO;
using Group4.FacilitiesReport.DTO.Enums;
using Group4.FacilitiesReport.DTO.Models;
using Group4.FacilitiesReport.Interface;
using Group4.FacilitiesReport.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Data;
using System.Threading.Tasks;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUser _iUser;
        private readonly IMapper _mapper;
        private readonly FacilitiesFeedbackManagement_SWP391Context _context;

        public UserController(IUser IUser, IMapper mapper,FacilitiesFeedbackManagement_SWP391Context context)
        {
            _iUser = IUser;
            _mapper = mapper;
            _context = context;
        }
        //[Authorize("Manager")]
        [HttpGet("CountUserActive")]
        public async Task<IActionResult> CountUserActive()
        {
            int count = await _iUser.CountUsersActive();
            return Ok(count);
        }
        //[Authorize("Manager")]
        [HttpGet("CountUserBanned")]
        public async Task<IActionResult> CountUserBanned()
        {
            int count = await _iUser.CountUsersBanned();
            return Ok(count);
        }
        //[Authorize("Manager")]
        [HttpGet("CountUserProvideFb")]
        public async Task<IActionResult> CountUserProvideFb()
        {
            int count = await _iUser.CountUsersWhoProvidedFeedback();
            return Ok(count);
        }
        [HttpGet("CountUserProvideFbToday")]
        public async Task<IActionResult> CountUserProvideFbToday()
        {
            int count = await _iUser.CountUsersWhoProvidedFeedbackToday();
            return Ok(count);
        }
        //[Authorize("Manager")]
        [HttpGet("AllUsers")]
        public async Task<IActionResult> GetAllUser()
        {
            var users = await this._iUser.GetUsers();
            if (users == null)
            {
                return NotFound();
            }
            return Ok(users);
        }
        //[Authorize("Manager")]
        [HttpGet("{UserId}")]
        public async Task<IActionResult> GetUserByUserId(string UserId)
        {
            var user = await _iUser.GetUserById(UserId);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }
        //[Authorize("Manager")]
        [HttpGet("Employee/{CateId}")]
        public async Task<IActionResult> GetEmployeeByCate(string CateId)
        {
            var users = await _iUser.GetEmployeeByCate(CateId);
            if (users == null)
            {
                return NotFound();
            }
            return Ok(users);
        }
        //[Authorize("Manager")]
        [HttpGet("CountEmployeeTask/{CateId}")]
        public async Task<IActionResult> CountEmployeeTask(string CateId)
        {
            var data = await _iUser.CountEmployeeTask(CateId);
            if (data == null)
            {
                return NotFound();
            }
            return Ok(data);
        }

        
        [HttpGet("Login")]
        public async Task<IActionResult> Login(string Email, string Password)
        {
            var user = await _iUser.Login(Email,Password);
            if (user == null)
            {
                return Unauthorized();
            }
          
            
            return Ok(user);
        }

        //[Authorize("Manager")]
        [HttpGet("UserProvideFb")]
        public async Task<IActionResult> GetUserProvideFeedbak()
        {
            var user = await _iUser.GetUsersWhoProvidedFeedback();
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }
        //[Authorize("Manager")]
        [HttpPost("AddUser")]
        public async Task<IActionResult> AddUser(string UserId, string Email, string Username, string Password, int RoleId)
        {
            

            var user = await _iUser.AddUser(new User
            {
                UserID = UserId,
                Email = Email,
                Username=Username,
                Password = Password,
                RoleId = RoleId,
                Status = "Active"
            });
            return Ok(user);
        }
        //[Authorize("Manager")]
        [HttpPost("AddCateByUserId")]
        public async Task<IActionResult> AddCateByUserId(string UserId, string CateId)
        {
            var user = await _iUser.AddCateByUserId(UserId, CateId);
            return Ok(user);
        }
        

        
        [HttpPut("UpdateUser/{UserId}")]
        public async Task<IActionResult> UpdateUser(string UserId, string UserName, string Email, string Password)
        {
            var user = await _iUser.UpdateUser(new User
            {
                UserID = UserId,
                Username = UserName,
                Email = Email,
                Password = Password
            });
            return Ok(user);
        }
        //[Authorize("Manager")]
        [HttpPut("BannedUser")]
        public async Task<IActionResult> BannedUser(string UserId)
        {
            return Ok(await _iUser.UpdateStatus(UserId, 2));
        }
        //[Authorize("Manager")]
        [HttpPut("Active")]
        public async Task<IActionResult> ActiveUser(string UserId)
        {
            return Ok(await _iUser.UpdateStatus(UserId, 0));
        }
     
        
        

    }
}
