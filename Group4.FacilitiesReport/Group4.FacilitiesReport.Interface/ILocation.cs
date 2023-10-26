using Group4.FacilitiesReport.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Group4.FacilitiesReport.Interface
{
    public interface ILocation
    {
        public Task<List<Location>> GetLocations();
        public Task<Location> GetLocationById(string LocationId);
        public Task<List<Location>> GetLocationsDisable();
        public Task<List<Location>> GetLocationsEnable();
        public Task<APIResponse> AddLocation(Location Loca);
        //fix update status 
        public Task<APIResponse> StatusLocation(string LocationId, int Status);
        public Task<APIResponse> DeleteLocation(string LocationId);
    }
}
