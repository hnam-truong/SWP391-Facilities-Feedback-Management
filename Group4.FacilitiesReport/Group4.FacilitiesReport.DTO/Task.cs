namespace Group4.FacilitiesReport.DTO
{
    public class Task
    {
        public Guid Id { get; set; }
        public Guid FeedbackId { get; set; }
        public string EmployeeId { get; set; } = null!;
        public string ManagerId { get; set; } = null!;
        public DateTime? DateTime { get; set; }
        public string ImgConfirmationUrl { get; set; } = null!;
        public string? Note { get; set; }
        public string Status { get; set; }
        public string? Responsed { get; set; } 

        public User Employee { get; set; } = null!;
        public Feedback Feedback { get; set; } = null!;
        public User Manager { get; set; } = null!;
    }
}