using Group4.FacilitiesReport.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Group4.FacilitiesReport.Interface
{
    internal interface IEmployee  : IUser
    {
        bool ModifyCateId(List<Category> categories);

    }
}
