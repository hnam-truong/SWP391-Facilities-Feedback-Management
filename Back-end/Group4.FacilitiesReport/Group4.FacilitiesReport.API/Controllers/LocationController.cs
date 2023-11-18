using Group4.FacilitiesReport.DTO;
using Group4.FacilitiesReport.Interface;
using Group4.FacilitiesReport.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Group4.FacilitiesReport.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LocationController : ControllerBase
    {
        private readonly ILocation _location;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public LocationController(ILocation location, IWebHostEnvironment webHostEnvironment)
        {
            _location = location;
            _webHostEnvironment = webHostEnvironment;
        }

        
        [HttpGet("GetAllLocation")]
        public async Task<IActionResult> GetLocations()
        {
            var data = await _location.GetLocations();
            if (data == null)
            {
                return NotFound();
            }
            return Ok(data);
        }
        //[Authorize("Manager")]
        [HttpGet("LocationEnable")]
        public async Task<IActionResult> GetLocationEnable()
        {
            var loca = await _location.GetLocationsEnable();
            if (loca == null)
            {
                return NotFound();
            }
            return Ok(loca);
        }
        //[Authorize("Manager")]
        [HttpGet("LocationDisable")]
        public async Task<IActionResult> GetLocationDisable()
        {
            var loca = await _location.GetLocationsDisable();
            if (loca == null)
            {
                return NotFound();
            }
            return Ok(loca);
        }
        //[Authorize("Manager")]
        [HttpGet("{LocationId}")]
        public async Task<IActionResult> GetLocationbyLocationId(string LocationId)
        {
            var loca = await _location.GetLocationById(LocationId);
            if (loca == null)
            {
                return NotFound();
            }
            return Ok(loca);
        }
        //[Authorize("Manager")]
        [HttpPost("AddLocation")]
        public async Task<IActionResult> AddLocation(string LocationId, string Disable)
        {
            var location = await _location.AddLocation(new Location
            {
                LocationId = LocationId,
                Disable = Disable
            });
            return Ok(location);
        }
        //[Authorize("Manager")]
        [HttpPut("DisableLocation")]
        public async Task<IActionResult> DisableLocation(string LocationId) => Ok(await _location.StatusLocation(LocationId, 1));
        //[Authorize("Manager")]
        [HttpPut("EnableLocation")]
        public async Task<IActionResult> EnableLocation(string LocationId) => Ok(await _location.StatusLocation(LocationId, 0));

        
    }
}
