using Server.Models.Authentication;

namespace Server.Services.Interfaces
{
  public interface IUserService
  {
    bool IsEmailVerified(string email);
    void MarkEmailVerified(string email);
    bool Register(string email, string password);
    bool ValidateCredentials(string email, string password);
    User? GetUser(string email);
  }
}