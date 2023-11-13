namespace Group4.FacilitiesReport.DTO
{
    public class Feedback
    {
        public Guid FeedbackId { get; set; }
        public string UserId { get; set; } = null!;
        public DateTime? DateTime { get; set; }
        public string Title { get; set; } = null!;
        public string Description { get; set; } = null!;
        public string? DataUrl { get; set; }
        public string? Response { get; set; }
        public string CateId { get; set; } = null!;
        public string LocationId { get; set; } = null!;
        public string Status { get; set; }
        public int Notify { get; set; }

        public Category Cate { get; set; } = null;
        public User User { get; set; } = null!;
        public Location location { get; set; } = null!;
        public ICollection<DTO.Task> Tasks { get; set; }

    }
}