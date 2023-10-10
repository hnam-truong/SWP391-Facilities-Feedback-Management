using System;
using System.Collections.Generic;

namespace Group4.FacilitiesReport.DTO.Models
{
    public partial class TblCategoriesProblem
    {
        public TblCategoriesProblem()
        {
            TblFeedbacks = new HashSet<TblFeedback>();
            Users = new HashSet<TblUser>();
        }

        public string Id { get; set; } = null!;
        public string Description { get; set; } = null!;

        public virtual ICollection<TblFeedback> TblFeedbacks { get; set; }

        public virtual ICollection<TblUser> Users { get; set; }
    }
}
