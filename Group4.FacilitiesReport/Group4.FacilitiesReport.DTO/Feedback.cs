namespace Group4.FacilitiesReport.DTO
{
    public class Feedback
    {
        public Guid FeedbackId { get; set; }
        public string UserId { get; set; } = null!;
        public DateTime? DateTime { get; set; }
        public string Title { get; set; } = null!;
        public string Description { get; set; } = null!;
        public string? VideoUrl { get; set; }
        public string? ImgUrl { get; set; }
        public string? Response { get; set; }
        public string CateId { get; set; } = null!;
        public string LocationId { get; set; } = null!;
        public int Status { get; set; }
        public int Notify { get; set; }
    }
}