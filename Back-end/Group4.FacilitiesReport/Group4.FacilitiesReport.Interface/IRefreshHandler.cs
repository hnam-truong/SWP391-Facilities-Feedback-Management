namespace Group4.FacilitiesReport.Interface
{
    public interface IRefreshHandler
    {
        public Task<string> GenerateToken(string userId);
    }
}
