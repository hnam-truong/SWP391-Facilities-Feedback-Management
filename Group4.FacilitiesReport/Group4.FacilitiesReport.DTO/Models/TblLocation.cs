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

<<<<<<< HEAD
        public string LocationID { get; set; } = null!;
=======
        public string LocationId { get; set; } = null!;
>>>>>>> back3
        public int? Disable { get; set; }

        public virtual ICollection<TblFeedback> TblFeedbacks { get; set; }
    }
}
