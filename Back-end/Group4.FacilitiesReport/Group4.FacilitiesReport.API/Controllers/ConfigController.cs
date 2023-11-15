using Group4.FacilitiesReport.DTO;
using Group4.FacilitiesReport.Interface;
using Microsoft.AspNetCore.Mvc;

namespace Group4.FacilitiesReport.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ConfigController : ControllerBase
    {
        private readonly IConfig _config;

        public ConfigController(IConfig config)
        {
            _config = config;
        }

        [HttpGet]
        public async Task<IActionResult> GetConfig()
        {
            return Ok(await _config.GetConfig());

        }

        [HttpPut]
        public async Task<IActionResult> Config(ConfigDTO config)
        {
            return Ok(await _config.Config(config.Variable, config.Value));
        }
        
    }
}
