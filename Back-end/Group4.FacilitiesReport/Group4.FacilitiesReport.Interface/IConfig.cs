using Group4.FacilitiesReport.DTO;

namespace Group4.FacilitiesReport.Interface
{
    public interface IConfig
    {
        public Task<List<ConfigDTO>> GetConfig();
        public Task<APIResponse> Config(string variable, string value);
        public Task<string> ValueOf(string variable);
    }
}
