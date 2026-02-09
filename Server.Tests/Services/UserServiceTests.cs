using Travel.Genie.Services;
using Travel.Genie.Models.Authentication;
using Travel.Genie.Data;
using Xunit;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Moq;

namespace Server.Tests.Services
{
  public class UserServiceTests
  {
    private static IDbContextFactory<AppDbContext> CreateInMemoryContextFactory()
    {
      var options = new DbContextOptionsBuilder<AppDbContext>()
        .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
        .Options;

      var mockFactory = new Mock<IDbContextFactory<AppDbContext>>();
      mockFactory.Setup(f => f.CreateDbContext()).Returns(() => new AppDbContext(options));
      mockFactory.Setup(f => f.CreateDbContextAsync(default)).ReturnsAsync(() => new AppDbContext(options));

      return mockFactory.Object;
    }

    [Fact]
    public void Register_And_ValidateCredentials_ShouldWork()
    {
      var contextFactory = CreateInMemoryContextFactory();
      var service = new UserService(contextFactory);
      var email = "user@example.com";
      var password = "securePass123";

      var registered = service.Register(email, password);
      registered.Should().BeTrue();

      var valid = service.ValidateCredentials(email, password);
      valid.Should().BeTrue();

      var invalid = service.ValidateCredentials(email, "wrongPass");
      invalid.Should().BeFalse();
    }

    [Fact]
    public void MarkEmailVerified_ShouldSetVerified()
    {
      var contextFactory = CreateInMemoryContextFactory();
      var service = new UserService(contextFactory);
      var email = "user@example.com";

      service.MarkEmailVerified(email);
      service.IsEmailVerified(email).Should().BeTrue();
    }

    [Fact]
    public void GetUser_ShouldReturnUser()
    {
      var contextFactory = CreateInMemoryContextFactory();
      var service = new UserService(contextFactory);
      var email = "user@example.com";
      var password = "securePass123";

      service.Register(email, password);
      var user = service.GetUser(email);

      user.Should().NotBeNull();
      user!.Email.Should().Be(email);
    }
  }
}