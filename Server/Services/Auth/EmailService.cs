using SendGrid;
using SendGrid.Helpers.Mail;
using Server.Services.Interfaces;

namespace Server.Services;

public class EmailService : IEmailService
{
  private readonly string _apiKey;
  private readonly string _from;
  private readonly string _templatePath;

  public EmailService(IConfiguration config)
  {
    _apiKey = config["SendGrid:ApiKey"] ?? throw new ArgumentNullException(nameof(config));
    _from = config["SendGrid:From"] ?? throw new ArgumentNullException(nameof(config));
    _templatePath = Path.Combine(AppContext.BaseDirectory, "Templates", "otp-template.html");
  }

  public async Task SendOtpAsync(string toEmail, string otp)
  {
    var htmlTemplate = await File.ReadAllTextAsync(_templatePath);
    var htmlBody = htmlTemplate.Replace("{{OTP}}", otp);

    var client = new SendGridClient(_apiKey);
    var from = new EmailAddress(_from, "Travel Genie");
    var subject = "Your Travel Genie OTP Code";
    var to = new EmailAddress(toEmail);
    var plainTextContent = $"Your OTP is {otp}. It expires in 5 minutes.";
    var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlBody);

    var response = await client.SendEmailAsync(msg);

    if (!response.IsSuccessStatusCode)
    {
      throw new Exception($"Failed to send email: {response.StatusCode}");
    }
  }
}
