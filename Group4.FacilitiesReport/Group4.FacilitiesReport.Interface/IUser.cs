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
        bool UserExists(string userId);
        ICollection<TblUser> GetUsers();
        TblUser GetUserById(string userId);
        Task<TblUser> Login(string username, string password);
        bool ModifyInfo(string userId, TblUser user);
        bool Save();

    }
}
