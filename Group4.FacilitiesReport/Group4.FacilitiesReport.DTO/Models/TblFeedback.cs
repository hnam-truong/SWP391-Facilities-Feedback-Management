using System;
using System.Collections.Generic;

namespace Group4.FacilitiesReport.DTO.Models
{
    public partial class TblFeedback
    {
        public TblFeedback()
        {
            Tasks = new HashSet<TblTask>();
        }

        public Guid FeedbackId { get; set; }
        public string UserId { get; set; } = null!;
        public DateTime DateTime { get; set; }
        public string Title { get; set; } = null!;
        public string Description { get; set; } = null!;
        public string DataUrl { get; set; } = null!;
        public string? Response { get; set; }
        public string CateId { get; set; } = null!;
        public string LocationId { get; set; } = null!;
        public int? Status { get; set; }
        public int? Notify { get; set; }

        public virtual TblCategoriesProblem Cate { get; set; } = null!;
        public virtual TblLocation Location { get; set; } = null!;
        public virtual TblUser User { get; set; } = null!;
        public virtual ICollection<TblTask> Tasks { get; set; }
    }
}
