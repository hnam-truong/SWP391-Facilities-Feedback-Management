using AutoMapper;
using Group4.FacilitiesReport.DTO;
using Group4.FacilitiesReport.DTO.Models;
using Group4.FacilitiesReport.Interface;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Group4.FacilitiesReport.Repositories
{
    public class ConfigRepo : IConfig
    {
        private readonly FacilitiesFeedbackManagement_SWP391Context _context;
        private readonly IMapper _mapper;
        private readonly ILogger<ConfigRepo> _logger;

        public ConfigRepo(FacilitiesFeedbackManagement_SWP391Context context, IMapper mapper,ILogger<ConfigRepo> logger)
        {
            _context = context;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<APIResponse> Config(string variable, string value)
        {
            _logger.LogInformation("Begin Get Config");
            APIResponse response = new APIResponse();
            var item = await _context.TblConfigs.FirstOrDefaultAsync(c => c.Variable == variable);
            if (item != null)
            {
                item.Value = value;
                await _context.SaveChangesAsync();
                response.ResponseCode = 200;
                response.Result = item.Variable + ":" + item.Value;
            }
            return response;
        }

        public async Task<List<ConfigDTO>> GetConfig()
        {
            _logger.LogInformation("Begin Get Configs");
            var response = new List<ConfigDTO>();
            var list = await _context.TblConfigs.ToListAsync();
            if (list != null)
            {
                response = _mapper.Map<List<ConfigDTO>>(list);
            }
            return response;
        }

        public async Task<string> ValueOf(string variable)
        {
            _logger.LogInformation("Begin Value Of");
            var item = await _context.TblConfigs.FirstOrDefaultAsync(c => c.Variable == variable);
            if (item != null && item.Value != null)
            {
                return item.Value;
            }
            else return "Invalid Config Variable";
        }
    }
}
