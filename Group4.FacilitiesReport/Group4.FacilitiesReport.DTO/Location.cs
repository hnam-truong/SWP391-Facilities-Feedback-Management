namespace Group4.FacilitiesReport.DTO
{
    internal class Location
    {
        public string LocationId { get; set; } = null!;
        public int? Disable { get; set; }

        public ICollection<Feedback> Feedbacks { get; set; }
    }

}
