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
        public Task<List<Location>> GetLocationsByDisable(int Disable);
        public Task<APIResponse> AddLocation(Location Loca);
        //fix update status 
        public Task<APIResponse> UpdateLocation(Location Loca);
        public Task<APIResponse> DeleteLocation(string LocationId);
    }
}
