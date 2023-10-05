using Group4.FacilitiesReport.DAO.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Group4.FacilitiesReport.Interface
{
    internal interface IUser
    {
        public bool ChangePassword(DTO.User user);
        public bool UpdateInfo( DTO.User user);


    }
}
