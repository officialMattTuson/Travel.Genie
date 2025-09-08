using System.Collections.Concurrent;
using Server.Services.Interfaces;

namespace Server.Services;

public class OtpService: IOtpService
{
  private readonly ConcurrentDictionary<string, (string Otp, DateTime Expiry)> _otps = new();
  private readonly IEmailService _emailService;

  public OtpService(IEmailService emailService)
  {
    _emailService = emailService;
  }

  public async Task<string> GenerateOtpAsync(string email)
  {
    var otp = new Random().Next(100000, 999999).ToString();
    var expiry = DateTime.UtcNow.AddMinutes(5);

    _otps[email] = (otp, expiry);

    await _emailService.SendOtpAsync(email, otp);

    return otp;
  }

  public bool VerifyOtp(string email, string otp)
  {
    if (_otps.TryGetValue(email, out var entry))
    {
      if (entry.Otp == otp && entry.Expiry > DateTime.UtcNow)
      {
        _otps.TryRemove(email, out _);
        return true;
      }
    }
    return false;
  }
}
