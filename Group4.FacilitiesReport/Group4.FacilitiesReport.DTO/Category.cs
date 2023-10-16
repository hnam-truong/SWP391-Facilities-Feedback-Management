namespace Group4.FacilitiesReport.DTO
{
    public class Category
    {
        public string Id { get; set; } = null!;
        public string Description { get; set; } = null!;
        public ICollection<Feedback> TblFeedbacks { get; set; }
        public ICollection<User> Users { get; set; }
    }
}