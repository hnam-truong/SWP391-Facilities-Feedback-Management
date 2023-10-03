namespace Group4.FacilitiesReport.DTO
{
    public class Task
    {
        public int Id { get; set; }
        public Guid FeedbackId { get; set; }
        public string EmployeeId { get; set; } = null!;
        public string ManagerId { get; set; } = null!;
        public DateTime? DateTime { get; set; }
        public string ImgConfirmationUrl { get; set; } = null!;

    }
}