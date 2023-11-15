using System;
using System.Collections.Generic;

namespace Group4.FacilitiesReport.DTO.Models
{
    public partial class TblUserRole
    {
        public TblUserRole()
        {
            TblUsers = new HashSet<TblUser>();
        }

        public int RoleId { get; set; }
        public string Description { get; set; } = null!;

        public virtual ICollection<TblUser> TblUsers { get; set; }
    }
}
