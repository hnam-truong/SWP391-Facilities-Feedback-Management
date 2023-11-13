namespace Group4.FacilitiesReport.DTO
{
    public class Location
    {
        public string LocationId { get; set; } = null!;
        public string? Disable { get; set; }

        public ICollection<Feedback> Feedbacks { get; set; }
    }

}
