using AutoMapper;
using Group4.FacilitiesReport.DTO;
using Group4.FacilitiesReport.DTO.Enums;
using Group4.FacilitiesReport.Interface;
using Microsoft.AspNetCore.Mvc;
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
        [HttpGet("CountUserStatus")]
        public async Task<IActionResult> CountUserByStatus(string Status)
        {
            Enum.TryParse(Status, out Group4.FacilitiesReport.DTO.Enums.UserStatus enumValue);
            int count = await _iUser.CountUsersByStatus((int)enumValue);
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

        [HttpPut("UpdateUserStatus/{UserId}")]
        public async Task<IActionResult> UpdateUserStatus(string UserId, string Status)
        {
            Enum.TryParse(Status, out UserStatus enumValue);
            var user = await _iUser.UpdateStatusUser(UserId, (int)enumValue);
            return Ok(user);
        }

       

        
    }
}
