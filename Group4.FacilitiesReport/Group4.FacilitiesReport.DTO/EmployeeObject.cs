using Group4.FacilitiesReport.DTO.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Group4.FacilitiesReport.DTO
{
    public class EmployeeObject : User
    {
        public int CountTask { get; set; }
    }
}
