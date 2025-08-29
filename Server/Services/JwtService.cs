using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Server.Services.Interfaces;

namespace Server.Services;

public class JwtService: IJwtService
{
  private readonly string _secret;
  private readonly string _issuer;
  private readonly string _audience;

  public JwtService(IConfiguration config)
  {
    _secret = config["Jwt:Secret"] ?? throw new Exception("JWT Secret not configured");
    _issuer = config["Jwt:Issuer"] ?? "AuthDemo";
    _audience = config["Jwt:Audience"] ?? "AuthDemoUsers";
  }

  public string GenerateToken(string email)
  {
    var claims = new[]
    {
            new Claim(JwtRegisteredClaimNames.Sub, email),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secret));
    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

    var token = new JwtSecurityToken(
        issuer: _issuer,
        audience: _audience,
        claims: claims,
        expires: DateTime.UtcNow.AddHours(1),
        signingCredentials: creds);

    return new JwtSecurityTokenHandler().WriteToken(token);
  }
}
