using System;
using System.Collections.Generic;

namespace Group4.FacilitiesReport.DTO.Models
{
    public partial class TblTask
    {
        public Guid Id { get; set; }
        public Guid FeedbackId { get; set; }
        public string EmployeeId { get; set; } = null!;
        public string ManagerId { get; set; } = null!;
        public DateTime? DateTime { get; set; }
        public string ImgConfirmationUrl { get; set; } = null!;
        public string? Note { get; set; }
        public int? Status { get; set; }
        public string? Responsed { get; set; }

        public virtual TblUser Employee { get; set; } = null!;
        public virtual TblFeedback Feedback { get; set; } = null!;
        public virtual TblUser Manager { get; set; } = null!;
    }
}
