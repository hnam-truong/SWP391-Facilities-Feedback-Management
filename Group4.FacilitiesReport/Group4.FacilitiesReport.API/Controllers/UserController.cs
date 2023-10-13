using AutoMapper;
using Group4.FacilitiesReport.DTO.Models;
using Group4.FacilitiesReport.DTO;
using Group4.FacilitiesReport.Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore.SqlServer.Storage.Internal;
using Microsoft.Data.SqlClient;
using System.Diagnostics.CodeAnalysis;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUser _iUser;
        private readonly IMapper _mapper;

        private readonly IConfiguration _configuration;

        public UserController(IUser IUser, IMapper mapper,  IConfiguration configuration)
        {
            _iUser = IUser;
            _mapper = mapper;
            _configuration = configuration;
        }

        [HttpGet("list")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<TblUser>))]
        public IActionResult GetUsers()
        {
            var users = _mapper.Map<List<User>>(_iUser.GetUsers());

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(users);
        }
        [HttpGet("{userId}")]
        [ProducesResponseType(200, Type = typeof(TblUser))]
        [ProducesResponseType(400)]
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
        public ActionResult<int> CountUsersByStatus(int status)
        {
            var count = _iUser.CountUsersByStatus(status);

            return Ok(count);
        }

        [HttpPut("{userId}")]
        [ProducesResponseType(400)]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public IActionResult ModifyInfo([FromRoute] string userId, [FromQuery] string userName, [FromQuery] string email, [FromQuery] string password) 
        {
            var userExist = _iUser.GetUserById(userId);
            if(userExist == null)
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
