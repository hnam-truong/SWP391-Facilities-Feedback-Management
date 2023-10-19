using Group4.FacilitiesReport.DTO;
using Group4.FacilitiesReport.Interface;
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


        [HttpGet("GetAllLoca")]
        public async Task<IActionResult> GetLocations()
        {
            var data = await _location.GetLocations();
            if (data == null)
            {
                return NotFound();
            }
            return Ok(data);
        }

        [HttpGet("/LocationId")]
        public async Task<IActionResult> GetLocationbyLocationId(string LocationId)
        {
            var loca = await _location.GetLocationById(LocationId);
            if (loca == null)
            {
                return NotFound();
            }
            return Ok(loca);
        }

        [HttpGet("/Disable")]
        public async Task<IActionResult> GetLocationbyDisable(int Disable)
        {
            var loca = await _location.GetLocationsByDisable(Disable);
            if (loca == null)
            {
                return NotFound();
            }
            return Ok(loca);
        }
        [HttpPost("Add")]
        public async Task<IActionResult> AddLocation(string LocationId, string Disable)
        {
            var location = await _location.AddLocation(new Location
            {
                LocationId = LocationId,
                Disable = Disable
            });
            return Ok(location);
        }

        [HttpPut("UpdateLocation")]
        public async Task<IActionResult> UpdateLocation(string LocationId, string Disable)
        {
            var location = await _location.UpdateLocation(new DTO.Location
            {
                LocationId = LocationId,
                Disable = Disable
            });
            return Ok(location);
        }
        
        [HttpDelete("Delete")]
        public async Task<IActionResult> Delete(string LocationId)
        {
            return Ok(await _location.DeleteLocation(LocationId));
        }
    }
}
