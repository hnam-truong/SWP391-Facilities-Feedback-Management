using Group4.FacilitiesReport.DTO.Models;
using Group4.FacilitiesReport.Interface;


namespace Group4.FacilitiesReport.Repositories
{
    public class UserRepo : IUser
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

        public TblUser GetUserById(string userId)
        {
            return _context.TblUsers.Where(p => p.UserId == userId).FirstOrDefault();
        }

        public ICollection<TblUser> GetUsers()
        {
            if (_context.TblUsers.ToList() == null) throw new Exception();
            return _context.TblUsers.ToList();
        }

        public bool ModifyInfo(string userId, TblUser user)
        {
            _context.Update(user);
            return Save();
        }

        public bool UserExists(string userId)
        {
            return _context.TblUsers.Any(p => p.UserId == userId);
        }

       
    }
}
