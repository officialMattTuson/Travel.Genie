using Travel.Genie.Services;
using Travel.Genie.Services.Interfaces;
using Xunit;
using FluentAssertions;
using Microsoft.Extensions.Configuration;

namespace Server.Tests.Services
{

  public class OtpServiceTests
  {
    [Fact]
    public async Task GenerateOtp_ShouldStoreOtpAndAllowVerification()
    {
      var emailService = new FakeEmailService();
      var otpService = new OtpService(emailService);

      var email = "test@example.com";
      var otp = await otpService.GenerateOtpAsync(email);

      otp.Should().NotBeNullOrEmpty();

      var result = otpService.VerifyOtp(email, otp);
      result.Should().BeTrue();
    }

    private class FakeEmailService : IEmailService
    {
      public Task SendOtpAsync(string toEmail, string otp) => Task.CompletedTask;
    }

  }

}