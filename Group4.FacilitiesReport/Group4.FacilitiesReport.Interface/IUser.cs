using Group4.FacilitiesReport.DTO;
using Group4.FacilitiesReport.DTO.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Group4.FacilitiesReport.Interface
{
    public interface IUser
    {
        ICollection<TblUser> GetUsers();
        User GetUserById(string userId);
        User GetUserByFeedbackId(string feedbackId);

    }
}
