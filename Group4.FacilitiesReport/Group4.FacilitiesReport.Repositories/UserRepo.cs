using Group4.FacilitiesReport.DTO;
using Group4.FacilitiesReport.DTO.Models;
using Group4.FacilitiesReport.Interface;

namespace Group4.FacilitiesReport.Repositories
{
    public class UserRepo : IUser
    {
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
            throw new NotImplementedException();
        }
    }
}