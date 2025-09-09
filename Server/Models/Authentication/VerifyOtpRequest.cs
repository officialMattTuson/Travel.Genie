namespace Travel.Genie.Models.Authentication
{
  public record VerifyOtpRequest(string Email, string Otp);
}