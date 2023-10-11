using AutoMapper;
using Group4.FacilitiesReport.DTO.Models;
using Group4.FacilitiesReport.DTO;
using Group4.FacilitiesReport.Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

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
        [HttpPut("{userId}")]
        [ProducesResponseType(400)]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public IActionResult ModifyInfo(string userId,TblUser user) 
        {
            if (ModifyInfo == null)
                return BadRequest(ModelState);

            if (userId != user.UserId)
                return BadRequest(ModelState);

            if (!_iUser.UserExists(userId))
                return NotFound();

            if (!ModelState.IsValid)
                return BadRequest();

            var pokemonMap = _mapper.Map<TblUser>(user);

            if (!_iUser.ModifyInfo(userId, pokemonMap))
            {
                ModelState.AddModelError("", "Something went wrong updating owner");
                return StatusCode(500, ModelState);
            }

            return NoContent();
        }
    }
}
