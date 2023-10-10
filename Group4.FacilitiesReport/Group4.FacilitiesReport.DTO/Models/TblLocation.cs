using System;
using System.Collections.Generic;

namespace Group4.FacilitiesReport.DTO.Models
{
    public partial class TblLocation
    {
        public TblLocation()
        {
            TblFeedbacks = new HashSet<TblFeedback>();
        }

        public string LocationId { get; set; } = null!;
        public int? Disable { get; set; }

        public virtual ICollection<TblFeedback> TblFeedbacks { get; set; }
    }
}
