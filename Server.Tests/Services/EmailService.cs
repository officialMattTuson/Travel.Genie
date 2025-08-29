using Server.Services;
using Microsoft.Extensions.Configuration;
using Xunit;
using System.IO;
using System.Threading.Tasks;

namespace Server.Tests.Services
{
  public class EmailServiceTests
  {
    [Fact]
    public void SendOtpAsync_ShouldThrowIfApiKeyMissing()
    {
      var config = new ConfigurationBuilder()
          .AddInMemoryCollection(new Dictionary<string, string?>
          {
        { "SendGrid:From", "test@example.com" }
          })
          .Build();

      Assert.Throws<ArgumentNullException>(() =>
      {
        new EmailService(config);
      });
    }

    [Fact]
    public async Task SendOtpAsync_ShouldThrowIfTemplateMissing()
    {
      var config = new ConfigurationBuilder()
          .AddInMemoryCollection(new Dictionary<string, string?>
          {
                    { "SendGrid:ApiKey", "fake-key" },
                    { "SendGrid:From", "test@example.com" }
          })
          .Build();

      var service = new EmailService(config);

      // Delete template if exists
      var templatePath = Path.Combine(AppContext.BaseDirectory, "Templates", "otp-template.html");
      if (File.Exists(templatePath))
        File.Delete(templatePath);

      await Assert.ThrowsAsync<FileNotFoundException>(async () =>
      {
        await service.SendOtpAsync("user@example.com", "123456");
      });
    }
  }
}