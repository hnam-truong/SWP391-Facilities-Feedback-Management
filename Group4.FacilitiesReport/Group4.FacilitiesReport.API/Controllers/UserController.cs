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
    }
}
