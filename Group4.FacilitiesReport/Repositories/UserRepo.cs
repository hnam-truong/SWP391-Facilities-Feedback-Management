using Group4.FacilitiesReport.DAO.Models;
using Group4.FacilitiesReport.Interface;
using Microsoft.AspNet.Identity;

namespace Repositories
{
    public class UserRepo 
    {
        private readonly FacilitiesFeedbackManagement_SWP391Context _context;

        public UserRepo(FacilitiesFeedbackManagement_SWP391Context context)
        {
            _context = context;
        }

        public bool Save()
        {
            var saved = _context.SaveChanges();
            return saved > 0 ? true : false;
        }
        public bool ChangePassword(Group4.FacilitiesReport.DTO.User user)
        {
            _context.Update(user.Password);
            return Save();
        }
        public bool UPdateInfo(Group4.FacilitiesReport.DTO.User user)
        {
            _context.Update(user.Username);
            _context.Update(user.Email);
            return Save();
        }
    }
}