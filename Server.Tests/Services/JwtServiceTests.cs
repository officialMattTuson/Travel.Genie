using Server.Services;
using Microsoft.Extensions.Configuration;
using Xunit;
using FluentAssertions;

namespace Server.Tests.Services
{
  public class JwtServiceTests
  {
    [Fact]
    public void GenerateToken_ShouldReturnJwtString()
    {
      var config = new ConfigurationBuilder()
          .AddInMemoryCollection(new Dictionary<string, string?>
          {
                    { "Jwt:Secret", "xc0hv1H72OsyJViEfQvzLfzImVAYon/7yL2bXM0q7nQ=" },
                    { "Jwt:Issuer", "TestIssuer" },
                    { "Jwt:Audience", "TestAudience" }
          })
          .Build();

      var jwtService = new JwtService(config);
      var token = jwtService.GenerateToken("user@example.com", "user");

      token.Should().NotBeNullOrEmpty();
      token.Split('.').Length.Should().Be(3); // JWT has 3 parts
    }
  }
}