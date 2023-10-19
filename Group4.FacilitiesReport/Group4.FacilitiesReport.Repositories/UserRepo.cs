using AutoMapper;
using Group4.FacilitiesReport.DTO;
using Group4.FacilitiesReport.DTO.Models;
using Group4.FacilitiesReport.Interface;
using Microsoft.EntityFrameworkCore;
using System.Data;
using System.Threading.Tasks;

namespace Group4.FacilitiesReport.Repositories
{
    public class UserRepo : IUser
    {
        private readonly FacilitiesFeedbackManagement_SWP391Context _context;
        private readonly IMapper _mapper;

        public UserRepo(FacilitiesFeedbackManagement_SWP391Context context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        private IQueryable<TblUser> AllUser() => _context.TblUsers;

       


        public async Task<int> CountUsersByStatus(int status)
        {
            return await AllUser().Where(f => f.Status.Equals(status)).CountAsync();
        }

        public async Task<int> CountUsersWhoProvidedFeedback()
        {
            return await AllUser().Where(f => f.TblFeedbacks.Any()).CountAsync();
        }

        public async Task<List<User>> GetEmployeeByCate(string CateId)
        {
            var Cate = await _context.TblCategoriesProblems.FirstOrDefaultAsync();
            var data = await _context.TblUsers.Include(u => u.Cates).Include(u => u.Role).Where(u => u.Role.Description=="Employee" && u.Cates.Contains(Cate)).ToListAsync();
            return _mapper.Map<List<TblUser>, List<User>>(data);
        }

        public async Task<User> GetUserById(string userId)
        {
            User _response = new User();
            var _data = await AllUser().Where(f => f.UserId.Equals(userId)).FirstOrDefaultAsync();
            if (_data != null)
            {
                _response = _mapper.Map<TblUser, User>(_data);
            }
            return _response;
        }

        public async Task<List<User>> GetUsers()
        {
            List<User> _response = new List<User>();
            var _data = await AllUser().Include(u => u.Role).ToListAsync();
            if (_data != null)
            {
                _response = _mapper.Map<List<TblUser>, List<User>>(_data);
            }
            return _response;
        }

        public Task<List<User>> GetUsersByRole(int role)
        {
            throw new NotImplementedException();
        }

        public async Task<List<User>> GetUsersByStatus(int status)
        {
            List<User> _response = new List<User>();
            var _data = await AllUser().Where(f => f.Status.Equals(status)).ToListAsync();
            if (_data != null)
            {
                _response = _mapper.Map<List<TblUser>, List<User>>(_data);
            }
            return _response;
        }

        

        public async Task<List<User>> GetUsersWhoProvidedFeedback()
        {
            List<User> _response = new List<User>();
            var _data = await AllUser().Where(f => f.TblFeedbacks.Any()).ToListAsync();
            if (_data != null)
            {
                _response = _mapper.Map<List<TblUser>, List<User>>(_data);
            }
            return _response;
        }

        public async Task<User> Login(string Email, string Password)
        {
            
            var _data = await AllUser().Include(u => u.Role).Where(f => f.Email.ToLower()==Email.ToLower() && f.Password.Equals(Password)).FirstOrDefaultAsync();
            if (_data != null && _data.Status ==0)
            {
                 return  _mapper.Map<TblUser, User>(_data);
            }
            return null;
        }

        public async Task<APIResponse> AddUser(User user)
        {
            APIResponse response = new APIResponse();
            try
            {

                TblUser _user = _mapper.Map<User, TblUser>(user);
                await _context.TblUsers.AddAsync(_user);
                await _context.SaveChangesAsync();
                response.ResponseCode = 200;
                response.Result = user.UserID;
            }
            catch (Exception ex)
            {
                response.ResponseCode = 400;
                response.ErrorMessage = ex.Message;
            }
            return response;
        }

        public async Task<APIResponse> UpdateStatusUser(string UserId, int Status)
        {
            APIResponse response = new APIResponse();
            try
            {
                var _user = await _context.TblUsers.FindAsync(UserId);
                if (_user != null)
                {
                    _user.Status = Status;
                    await _context.SaveChangesAsync();
                    response.ResponseCode = 200;
                    response.Result = UserId;
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

        public async Task<APIResponse> UpdateUser(User User)
        {
            APIResponse response = new APIResponse();
            try
            {
                var _user = await _context.TblUsers.FindAsync(User.UserID);
                if (_user != null)
                {
                    _user.Username = User.Username;
                    _user.Email = User.Email;

                    await _context.SaveChangesAsync();
                    response.ResponseCode = 200;
                    response.Result = User.UserID;
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
