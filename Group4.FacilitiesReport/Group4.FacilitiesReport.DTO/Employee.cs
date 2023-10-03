namespace Group4.FacilitiesReport.DTO
{
    public class Employee : User
    {
        public string UserId { get; set; } = null!;
        public string Username { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public int? Role { get; set; }
        public int? Status { get; set; }
    }
}