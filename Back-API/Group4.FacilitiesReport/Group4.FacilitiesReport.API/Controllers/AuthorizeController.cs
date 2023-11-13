using Group4.FacilitiesReport.DTO;
using Group4.FacilitiesReport.DTO.Models;
using Group4.FacilitiesReport.Interface;
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
        private readonly IRefreshHandler _refreshHandler;

        public AuthorizeController(FacilitiesFeedbackManagement_SWP391Context context, IOptions<JwtSettings> options, IRefreshHandler refreshHandler)
        {
            _context = context;
            _jwtSettings = options.Value;
            _refreshHandler = refreshHandler;
        }

        [HttpPost("GenerateToken")]
        public async Task<IActionResult> GenerateToken([FromBody] UserCred UserCred)
        {
            var user = await this._context.TblUsers.Include(u => u.Role).FirstOrDefaultAsync(item => UserCred.email.ToLower() == item.Email.ToLower() && item.Password.Equals(UserCred.password));
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
                return Ok(new TokenResponse()
                {
                    Token = finaltoken,
                    RefreshToken = await _refreshHandler.GenerateToken(user.UserId),
                    Id = user.UserId,
                });
            }
            else
            {
                return Unauthorized();
            }
        }
        [HttpPost("GenerateRefreshToken")]
        public async Task<IActionResult> GenerateRefreshToken([FromBody] TokenResponse token)
        {
            var _refreshToken = await this._context.TblRefreshTokens.FirstOrDefaultAsync(item => item.RefreshToken == token.RefreshToken);
            if (_refreshToken != null)
            {
                //Generate Token

                var tokenHandler = new JwtSecurityTokenHandler();
                var tokenKey = Encoding.UTF8.GetBytes(this._jwtSettings.SecurityKey);
                SecurityToken securityToken;
                var principal = tokenHandler.ValidateToken(token.Token, new TokenValidationParameters()
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(this._jwtSettings.SecurityKey)),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                }, out securityToken);

                var _token = securityToken as JwtSecurityToken;
                if (_token != null && _token.Header.Alg.Equals(SecurityAlgorithms.HmacSha256))
                {
                    string username = principal.Identity?.Name;
                    var _existData = await this._context.TblRefreshTokens.FirstOrDefaultAsync(item => item.UserId == username && item.RefreshToken == token.RefreshToken);
                    if (_existData != null)
                    {
                        var _newToken = new JwtSecurityToken(
                            claims: principal.Claims.ToArray(),
                            expires: DateTime.Now.AddHours(2),
                            signingCredentials: new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(this._jwtSettings.SecurityKey)), SecurityAlgorithms.HmacSha256)
                            );
                        var _finalToken = tokenHandler.WriteToken(_newToken);
                        return Ok(new TokenResponse()
                        {
                            Token = _finalToken,
                            RefreshToken = await _refreshHandler.GenerateToken(username),
                            Id = _existData.UserId,
                        });
                    }
                    else
                    {
                        return Unauthorized();
                    }
                }
                else
                {
                    return Unauthorized();

                }
                //var tokenDesc = new SecurityTokenDescriptor
                //{
                //    Subject = new ClaimsIdentity(new Claim[]
                //    {
                //        new Claim(ClaimTypes.Name, user.Username),
                //        new Claim(ClaimTypes.Role, user.Role.Description)
                //    }),
                //    Expires = DateTime.UtcNow.AddHours(2),
                //    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(tokenKey), SecurityAlgorithms.HmacSha256)
                //};
                //var finaltoken = tokenHandler.WriteToken(tokenHandler.CreateToken(tokenDesc));
                //return Ok(new TokenResponse()
                //{
                //    Token = finaltoken,
                //    RefreshToken = await _refreshHandler.GenerateToken(user.UserId),
                //});
                //}
                //else
                //{
                //    return Unauthorized();
            }
            else
            {
                return Unauthorized();

            }
        }
    }
}
