namespace Server.Services.Interfaces
{
  public interface IEmailService
  {
    Task SendOtpAsync(string toEmail, string otp);
  }

}