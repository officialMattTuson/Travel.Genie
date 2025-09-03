using Server.Services;
using Server.Models.Authentication;
using Xunit;
using FluentAssertions;

namespace Server.Tests.Services
{
  public class UserServiceTests
  {
    [Fact]
    public void Register_And_ValidateCredentials_ShouldWork()
    {
      var service = new UserService();
      var email = "user@example.com";
      var username = "user";
      var password = "securePass123";

      var registered = service.Register(email, username, password);
      registered.Should().BeTrue();

      var valid = service.ValidateCredentials(email, password);
      valid.Should().BeTrue();

      var invalid = service.ValidateCredentials(email, "wrongPass");
      invalid.Should().BeFalse();
    }

    [Fact]
    public void MarkEmailVerified_ShouldSetVerified()
    {
      var service = new UserService();
      var email = "user@example.com";

      service.MarkEmailVerified(email);
      service.IsEmailVerified(email).Should().BeTrue();
    }

    [Fact]
    public void GetUser_ShouldReturnUser()
    {
      var service = new UserService();
      var email = "user@example.com";
      var username = "user";
      var password = "securePass123";

      service.Register(email, username, password);
      var user = service.GetUser(email);

      user.Should().NotBeNull();
      user!.Email.Should().Be(email);
      user.Username.Should().Be(username);
    }
  }
}