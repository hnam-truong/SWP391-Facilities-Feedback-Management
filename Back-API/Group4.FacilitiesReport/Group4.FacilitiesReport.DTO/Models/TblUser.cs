using System;
using System.Collections.Generic;

namespace Group4.FacilitiesReport.DTO.Models
{
    public partial class TblUser
    {
        public TblUser()
        {
            TblFeedbacks = new HashSet<TblFeedback>();
            TblTaskEmployees = new HashSet<TblTask>();
            TblTaskManagers = new HashSet<TblTask>();
            Cates = new HashSet<TblCategoriesProblem>();
        }

        public string UserId { get; set; } = null!;
        public string Username { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public int? RoleId { get; set; }
        public int? Status { get; set; }

        public virtual TblUserRole? Role { get; set; }
        public virtual ICollection<TblFeedback> TblFeedbacks { get; set; }
        public virtual ICollection<TblTask> TblTaskEmployees { get; set; }
        public virtual ICollection<TblTask> TblTaskManagers { get; set; }

        public virtual ICollection<TblCategoriesProblem> Cates { get; set; }
    }
}
