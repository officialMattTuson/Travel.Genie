namespace Server.Models
{
  public record VerifyOtpRequest(string Email, string Otp);
}