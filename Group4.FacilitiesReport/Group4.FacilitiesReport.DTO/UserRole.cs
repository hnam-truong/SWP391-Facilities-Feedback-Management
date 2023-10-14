namespace Group4.FacilitiesReport.DTO
{
    public class UserRole
    {
        public int RoleId { get; set; }
        public string Description { get; set; } = null!;

        public virtual ICollection<User> Users { get; set; }
    }
}
