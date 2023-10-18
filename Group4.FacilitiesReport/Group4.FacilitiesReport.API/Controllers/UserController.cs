using AutoMapper;
using Group4.FacilitiesReport.DTO;
using Group4.FacilitiesReport.Interface;
using Microsoft.AspNetCore.Mvc;

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

        [HttpGet("{userId}")]
        public IActionResult GetUserById(string userId)
        {
            if (!_iUser.UserExists(userId))
                return NotFound();

            var user = _mapper.Map<User>(_iUser.GetUserById(userId));

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(user);
        }
        [HttpGet("status/{status}")]
        public ActionResult<IEnumerable<User>> GetUsersByStatus(int status)
        {
            var users = _iUser.GetUsersByStatus(status);
            var userDtos = _mapper.Map<IEnumerable<User>>(users);

            return Ok(userDtos);
        }
        [HttpGet("role/{role}")]
        public ActionResult<IEnumerable<User>> GetUsersByRole(int role)
        {
            var users = _iUser.GetUsersByRole(role);
            var userDtos = _mapper.Map<IEnumerable<User>>(users);

            return Ok(userDtos);
        }

        [HttpGet("feedback")]
        public ActionResult<IEnumerable<User>> GetUsersWhoProvidedFeedback()
        {
            var users = _iUser.GetUsersWhoProvidedFeedback();

            return Ok(users);
        }

        [HttpGet("feedback/count")]
        public ActionResult<int> CountUsersWhoProvidedFeedback()
        {
            var count = _iUser.CountUsersWhoProvidedFeedback();

            return Ok(count);
        }

        [HttpPost("login")]
        [ProducesResponseType(200)]
        [ProducesResponseType(401)]

        public async Task<IActionResult> Login(string username, string password)
        {
            var user = await _iUser.Login(username, password);
            if (user == null)
            {
                return Unauthorized("Wrong user or password");
            }

            return Ok(user);
        }

        [HttpGet("countStatus")]
        [ProducesResponseType(200)]
        public ActionResult<int> CountUsersByStatus(int status)
        {
            var count = _iUser.CountUsersByStatus(status);

            return Ok(count);
        }

        [HttpPut("{userId}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public IActionResult ModifyInfo([FromRoute] string userId, [FromQuery] string userName, [FromQuery] string email, [FromQuery] string password)
        {
            var userExist = _iUser.GetUserById(userId);
            if (userExist == null)
            {
                return NotFound();
            }

            userExist.Username = userName;
            userExist.Email = email;
            userExist.Password = password;
            _iUser.ModifyInfo(userExist);
            return Ok("Update Successful!!!");
        }


    }
}
