using AutoMapper;
using Group4.FacilitiesReport.DTO;
using Group4.FacilitiesReport.DTO.Models;
using Group4.FacilitiesReport.Interface;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

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


        public bool Save()
        {
            var saved = _context.SaveChanges();
            return saved > 0 ? true : false;
        }

        public TblUser GetUserById(string userId)
        {
            return _context.TblUsers.Where(p => p.UserId == userId).FirstOrDefault();
        }

        public ICollection<TblUser> GetUsers()
        {
            if (_context.TblUsers.ToList() == null) throw new Exception();
            return _context.TblUsers.ToList();
        }

        public bool ModifyInfo(TblUser user)
        {
            _context.Update(user);
            return Save();
        }

        public async Task<TblUser> Login(string username, string password)
        {
            var userEntity = await _context.TblUsers.SingleOrDefaultAsync(u => u.Email == username && u.Password == password);
            return _mapper.Map<TblUser>(userEntity); 
        }


        public bool UserExists(string userId)
        {
            return _context.TblUsers.Any(p => p.UserId == userId);
        }

      
    }
}
