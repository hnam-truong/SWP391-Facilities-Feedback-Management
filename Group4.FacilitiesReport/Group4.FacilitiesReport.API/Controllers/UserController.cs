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

        [HttpPost("login")]
        public async Task<IActionResult> Login(string username, string password)
        {
            var user = await _iUser.Login(username, password);
            if (user == null)
            {
                return Unauthorized();
            }

            // Generate and return a token, or set a cookie, etc.
            return Ok();
        }

        [HttpPut("{userId}")]
        [ProducesResponseType(400)]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public IActionResult ModifyInfo(string userId,[FromBody]User user) 
        {
            if (ModifyInfo == null)
                return BadRequest(ModelState);

            if (userId != user.UserID)
                return BadRequest(ModelState);

            if (!_iUser.UserExists(userId))
                return NotFound();

            if (!ModelState.IsValid)
                return BadRequest();

            var userMap = _mapper.Map<TblUser>(user);

            if (!_iUser.ModifyInfo(userId, userMap))
            {
                ModelState.AddModelError("", "Something went wrong updating owner");
                return StatusCode(500, ModelState);
            }

            return NoContent();
        }
       
    }
}
