﻿using AutoMapper;
using Group4.FacilitiesReport.DTO;
using Group4.FacilitiesReport.DTO.Models;
using Group4.FacilitiesReport.Interface;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Data;
using System.Threading.Tasks;

namespace Group4.FacilitiesReport.Repositories
{
    public class LocationRepo : ILocation
    {
        private readonly FacilitiesFeedbackManagement_SWP391Context _context;
        private readonly IMapper _mapper;
        private readonly ILogger<LocationRepo> _logger;

        public LocationRepo(FacilitiesFeedbackManagement_SWP391Context context, IMapper mapper, ILogger<LocationRepo> logger)
        {
            _context = context;
            _mapper = mapper;
            _logger = logger;
        }

        private IQueryable<TblLocation> AllLocation() => _context.TblLocations;


        public async Task<Location> GetLocationById(string LocationId)
        {
            Location _response = new Location();
            var _data = await AllLocation().Where(f => f.LocationId.ToLower().Equals(LocationId.ToLower())).FirstOrDefaultAsync();
            if (_data != null)
            {
                _response = _mapper.Map<TblLocation, Location>(_data);
            }
            return _response;
        }

        public async Task<List<Location>> GetLocations()
        {
            List<Location> _response = new List<Location>();
            var _data = await _context.TblLocations.ToListAsync();
            if (_data != null)
            {
                _response = _mapper.Map<List<TblLocation>, List<Location>>(_data);
            }
            return _response;
        }

        public async Task<List<Location>> GetLocationsDisable()
        {
            List<Location> _response = new List<Location>();
            var _data = await AllLocation().Where(f => f.Disable == 1).ToListAsync();
            if (_data != null)
            {
                _response = _mapper.Map<List<TblLocation>, List<Location>>(_data);
            }
            return _response;
        }
        public async Task<List<Location>> GetLocationsEnable()
        {
            List<Location> _response = new List<Location>();
            var _data = await AllLocation().Where(f => f.Disable == 0).ToListAsync();
            if (_data != null)
            {
                _response = _mapper.Map<List<TblLocation>, List<Location>>(_data);
            }
            return _response;
        }

        public async Task<APIResponse> AddLocation(Location Loca)
        {
            APIResponse _response = new APIResponse();
            try
            {
                TblLocation _location = _mapper.Map<Location, TblLocation>(Loca);
                await _context.TblLocations.AddAsync(_location);
                await _context.SaveChangesAsync(); ;
                _response.ResponseCode = 200;
                _response.Result = _location.LocationId;

            }
            catch (Exception ex)
            {
                _response.ResponseCode = 400;
                _response.ErrorMessage = ex.Message;
            }
            return _response;
        }

        public async Task<APIResponse> DisableLocation(string LocationId) => await StatusLocation(LocationId, 1);
        

        public async Task<APIResponse> EnableLocation(string LocationId) => await StatusLocation(LocationId, 0);


        public async Task<APIResponse> DeleteLocation(string LocationId)
        {
            APIResponse _response = new APIResponse();
            try
            {
                TblLocation? loca = await _context.TblLocations.FindAsync(LocationId);
                if (loca != null)
                {
                    _context.TblLocations.Remove(loca);
                    await _context.SaveChangesAsync();
                    _response.ResponseCode = 200;
                    _response.Result = LocationId;
                }
                else
                {
                    _response.ResponseCode = 400;
                    _response.Result = "Data not found!";

                }
            }
            catch (Exception ex)
            {
                _response.ResponseCode = 400;
                _response.Result = ex.Message;

            }
            return _response;
        }

        public async Task<APIResponse> StatusLocation(string LocationId, int Status)
        {
            APIResponse response = new APIResponse();
            try
            {
                var _loca = await _context.TblLocations.FindAsync(LocationId);
                if (_loca != null)
                {
                    _loca.Disable = Status;
                    await _context.SaveChangesAsync();
                    response.ResponseCode = 200;
                    response.Result = LocationId.ToString();
                }
                else
                {
                    response.ResponseCode = 404;
                    response.ErrorMessage = "Data not found";
                }

            }
            catch (Exception ex)
            {
                response.ResponseCode = 400;
                response.ErrorMessage = ex.Message;
            }
            return response;
        }
    }
}

