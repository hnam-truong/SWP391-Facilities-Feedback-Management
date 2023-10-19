using Group4.FacilitiesReport.DTO.Models;
using Group4.FacilitiesReport.Interface;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;

namespace Group4.FacilitiesReport.Repositories
{
    public class RefresHandler : IRefreshHandler
    {
        private readonly FacilitiesFeedbackManagement_SWP391Context _context;

        public RefresHandler(FacilitiesFeedbackManagement_SWP391Context context)
        {
            _context = context;
        }
        public async Task<string> GenerateToken(string userId)
        {
            var randomNumber = new byte[32];
            using (var randomNumberGenerator = RandomNumberGenerator.Create())
            {
                randomNumberGenerator.GetBytes(randomNumber);
                string refreshToken = Convert.ToBase64String(randomNumber);
                var ExistingToken = await this._context.TblRefreshTokens.FirstOrDefaultAsync(item => item.UserId == userId);
                if (ExistingToken != null)
                {
                    ExistingToken.RefreshToken = refreshToken;
                }
                else
                {
                    await this._context.TblRefreshTokens.AddAsync(new TblRefreshToken
                    {
                        UserId = userId,
                        TokenId = new Random().Next().ToString(),
                        RefreshToken = refreshToken,
                    });
                }
                await this._context.SaveChangesAsync();
                return refreshToken;
            }
        }
    }
}
