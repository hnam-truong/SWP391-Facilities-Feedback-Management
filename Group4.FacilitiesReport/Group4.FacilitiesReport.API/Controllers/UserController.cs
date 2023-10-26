using AutoMapper;
using Group4.FacilitiesReport.DTO;
using Group4.FacilitiesReport.DTO.Enums;
using Group4.FacilitiesReport.DTO.Models;
using Group4.FacilitiesReport.Interface;
using Group4.FacilitiesReport.Repositories;
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
        

        public UserController(IUser IUser, IMapper mapper)
        {
            _iUser = IUser;
            _mapper = mapper;
        }
        [HttpGet("CountUserActive")]
        public async Task<IActionResult> CountUserActive()
        {
            int count = await _iUser.CountUsersActive();
            return Ok(count);
        }
        [HttpGet("CountUserBanned")]
        public async Task<IActionResult> CountUserBanned()
        {
            int count = await _iUser.CountUsersBanned();
            return Ok(count);
        }
        [HttpGet("CountUserProvideFb")]
        public async Task<IActionResult> CountUserProvideFb()
        {
            int count = await _iUser.CountUsersWhoProvidedFeedback();
            return Ok(count);
        }
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
        [HttpGet("Employee")]
        public async Task<IActionResult> GetEmployeeByCate(string CateId)
        {
            var users = await _iUser.GetEmployeeByCate(CateId);
            if (users == null)
            {
                return NotFound();
            }
            return Ok(users);
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
        [HttpPost("AddUser")]
        public async Task<IActionResult> AddUser(string UserId, string Email, string Username, string Password)
        {
            var user = await _iUser.AddUser(new User
            {
                UserID = UserId,
                Email = Email,
                Username=Username,
                Password = Password,
                RoleId = 0,
                Status = "Active"
            });
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

        [HttpPut("BannedUser")]
        public async Task<IActionResult> BannedUser(string UserId)
        {
            return Ok(await _iUser.UpdateStatus(UserId, 2));
        }

        [HttpPut("Active")]
        public async Task<IActionResult> ActiveUser(string UserId)
        {
            return Ok(await _iUser.UpdateStatus(UserId, 0));
        }
     
        [HttpGet("CountEmployeeTask")]
        public async Task<IActionResult> CountEmployeeTask(string CateId)
        {
            var data = await _iUser.CountEmployeeTask(CateId);
            if(data == null)
            {
                return NotFound();
            }
            return Ok(data);
        }
        

    }
}
