using SendGrid;
using SendGrid.Helpers.Mail;
using Travel.Genie.Services.Interfaces;

namespace Travel.Genie.Services;

public class EmailService : IEmailService
{
  private readonly string _apiKey;
  private readonly string _from;
  private readonly string _templatePath;

  public EmailService(IConfiguration config)
  {
    if (config == null)
      throw new ArgumentNullException(nameof(config), "Configuration cannot be null");
    
    _apiKey = config["SendGrid:ApiKey"] ?? "development-no-api-key";
    _from = config["SendGrid:From"] ?? "noreply@travelgenie.com";
    _templatePath = Path.Combine(AppContext.BaseDirectory, "Templates", "otp-template.html");
  }

  public async Task SendOtpAsync(string toEmail, string otp)
  {
    // For development: just log the OTP instead of sending email if no valid API key
    if (string.IsNullOrEmpty(_apiKey) || 
        _apiKey == "development-no-api-key" || 
        _apiKey == "YOUR_SENDGRID_API_KEY_HERE" ||
        _apiKey.StartsWith("YOUR_"))
    {
      Console.WriteLine($"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      Console.WriteLine($"[DEV MODE] OTP Email for: {toEmail}");
      Console.WriteLine($"[DEV MODE] OTP Code: {otp}");
      Console.WriteLine($"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      return;
    }

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
