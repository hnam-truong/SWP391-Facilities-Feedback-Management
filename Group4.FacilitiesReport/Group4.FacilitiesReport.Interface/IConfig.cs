using Group4.FacilitiesReport.DTO;

namespace Group4.FacilitiesReport.Interface
{
    public interface IConfig
    {
        public Task<List<ConfigDTO>> GetConfig();
        public Task<APIResponse> Config(string variable, object value);
        public Task<object> ValueOf(string variable);
    }
}
