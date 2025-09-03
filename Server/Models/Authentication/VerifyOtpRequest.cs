namespace Server.Models.Authentication
{
  public record VerifyOtpRequest(string Email, string Otp);
}