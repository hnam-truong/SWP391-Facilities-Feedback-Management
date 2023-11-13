namespace Group4.FacilitiesReport.DTO
{
    public class FeedbackUpdatableObject
    {
        public Guid FeedbackId { get; set; }
        public string UserId { get; set; } = null!;
        public string Title { get; set; } = null!;
        public string Description { get; set; } = null!;
        public string CateId { get; set; } = null!;
        public string LocationId { get; set; } = null!;
        public int Notify { get; set; }
    }
}