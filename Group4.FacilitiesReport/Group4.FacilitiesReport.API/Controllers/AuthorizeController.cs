using Group4.FacilitiesReport.DTO;
using Group4.FacilitiesReport.DTO.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Group4.FacilitiesReport.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthorizeController : ControllerBase
    {
        private readonly FacilitiesFeedbackManagement_SWP391Context _context;
        private readonly JwtSettings _jwtSettings;

        public AuthorizeController(FacilitiesFeedbackManagement_SWP391Context context, IOptions<JwtSettings> options)
        {
            _context = context;
            _jwtSettings = options.Value;

        }

        [HttpPost("GenerateToken")]
        public async Task<IActionResult> GenerateToken([FromBody] UserCred UserCred)
        {
            var user = await this._context.TblUsers.Include(u => u.Role).FirstOrDefaultAsync(item => string.Equals(UserCred.email, item.Email, StringComparison.OrdinalIgnoreCase) && item.Password.Equals(UserCred.password));
            if (user != null)
            {
                //Generate Token
                var tokenHandler = new JwtSecurityTokenHandler();
                var tokenKey = Encoding.UTF8.GetBytes(this._jwtSettings.SecurityKey);
                var tokenDesc = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new Claim[]
                    {
                        new Claim(ClaimTypes.Name, user.UserId),
                        new Claim(ClaimTypes.Role, user.Role.Description)
                    }),
                    Expires = DateTime.UtcNow.AddHours(2),
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(tokenKey), SecurityAlgorithms.HmacSha256)
                };
                var finaltoken = tokenHandler.WriteToken(tokenHandler.CreateToken(tokenDesc));
                return Ok(finaltoken);
            }
            else
            {
                Unauthorized();
            }
            return Ok("");
        }
    }
}
