namespace Server.Services.Interfaces
{
  public interface IOtpService
  {
    Task<string> GenerateOtpAsync(string email);
    bool VerifyOtp(string email, string otp);
  }
}