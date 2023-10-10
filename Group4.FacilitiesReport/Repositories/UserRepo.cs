using Group4.FacilitiesReport.DTO;
using Group4.FacilitiesReport.DTO.Models;
using Group4.FacilitiesReport.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Group4.FacilitiesReport.Repositories
{
    public class UserRepo : IUser
    {
        private readonly FacilitiesFeedbackManagement_SWP391Context _context;

        public UserRepo(FacilitiesFeedbackManagement_SWP391Context context)
        {
            _context = context;
        }

        public User GetUserByFeedbackId(string feedbackId)
        {
            throw new NotImplementedException();
        }

        public User GetUserById(string userId)
        {
            throw new NotImplementedException();
        }

        public ICollection<TblUser> GetUsers()
        {
            if (_context.TblUsers.ToList() == null) throw new Exception();
            return _context.TblUsers.ToList();
        }
    }
}
