using AutoMapper;
using Group4.FacilitiesReport.DTO;
using Group4.FacilitiesReport.DTO.Models;
using Group4.FacilitiesReport.Interface;
using Microsoft.EntityFrameworkCore;

namespace Group4.FacilitiesReport.Repositories
{
    internal class ConfigRepo : IConfig
    {
        private readonly FacilitiesFeedbackManagement_SWP391Context _context;
        private readonly IMapper _mapper;

        public ConfigRepo(FacilitiesFeedbackManagement_SWP391Context context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<APIResponse> Config(string variable, object value)
        {
            APIResponse response = new APIResponse();
            var item = await _context.TblConfigs.FirstOrDefaultAsync(c => c.Variable == variable);
            if (item != null)
            {
                item.Value = value;
                await _context.SaveChangesAsync();
                response.ResponseCode = 200;
                response.Result = variable + ":" + value.ToString();
            }
            return response;
        }

        public async Task<List<ConfigDTO>> GetConfig()
        {
            var response = new List<ConfigDTO>();
            var list = await _context.TblConfigs.ToListAsync();
            if (list != null)
            {
                response = _mapper.Map<List<ConfigDTO>>(list);
            }
            return response;
        }

        public async Task<object> ValueOf(string variable)
        {
            var item = await _context.TblConfigs.FirstOrDefaultAsync(c => c.Variable == variable);
            if (item != null && item.Value != null)
            {
                return item.Value;
            }
            else return "Invalid Config Variable";
        }
    }
}
