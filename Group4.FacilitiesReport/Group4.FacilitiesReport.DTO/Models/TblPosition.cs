using System;
using System.Collections.Generic;

namespace Group4.FacilitiesReport.DAO.Models
{
    public partial class TblPosition
    {
        public TblPosition()
        {
            TblFeedbacks = new HashSet<TblFeedback>();
        }

        public string AreaId { get; set; } = null!;
        public int? Disable { get; set; }

        public virtual ICollection<TblFeedback> TblFeedbacks { get; set; }
    }
}
