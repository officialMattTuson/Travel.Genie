namespace Travel.Genie.Services.Interfaces
{
  public interface IJwtService
  {
    string GenerateToken(string email, Guid userId);
  }
}