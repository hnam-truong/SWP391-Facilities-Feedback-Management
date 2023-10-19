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
        Task<List<Location>> GetLocations();
        Task<Location> GetLocationById(string LocationId);
        Task<List<Location>> GetLocationsByDisable(int Disable);
        Task<APIResponse> AddLocation(Location Loca);
        Task<APIResponse> UpdateLocation(Location Loca);
    }
}
