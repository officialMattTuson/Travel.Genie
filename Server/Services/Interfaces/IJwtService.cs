namespace Server.Services.Interfaces
{
  public interface IJwtService
  {
    string GenerateToken(string email);
  }
}