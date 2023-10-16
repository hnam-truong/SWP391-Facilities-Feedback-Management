namespace Group4.FacilitiesReport.DTO
{
    public class User
    {
        public string UserID { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public int RoleId { get; set; }
        public string Status { get; set; }
        public UserRole Role { get; set; }
        public ICollection<Feedback> Feedbacks { get; set; }
        public ICollection<Task> TaskEmployees { get; set; }
        public ICollection<Task> TaskManagers { get; set; }

        public ICollection<Category> Cates { get; set; }
    }
}