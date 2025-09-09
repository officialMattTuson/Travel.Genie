namespace Travel.Genie.Services.Interfaces
{
  public interface IOtpService
  {
    Task<string> GenerateOtpAsync(string email);
    OtpVerificationResult VerifyOtp(string email, string otp);
  }
}