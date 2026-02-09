using System.Text;
using Travel.Genie.Models.Authentication;
using Konscious.Security.Cryptography;
using Travel.Genie.Services.Interfaces;
using Travel.Genie.Data;
using System.Collections.Concurrent;
using Microsoft.EntityFrameworkCore;

namespace Travel.Genie.Services;

public class UserService: IUserService
{
  private readonly IDbContextFactory<AppDbContext> _contextFactory;
  private readonly ConcurrentDictionary<string, bool> _verifiedEmails = new();

  public UserService(IDbContextFactory<AppDbContext> contextFactory)
  {
    _contextFactory = contextFactory;
  }

  public bool IsEmailVerified(string email)
  {
    if (_verifiedEmails.ContainsKey(email)) return true;
    
    using var context = _contextFactory.CreateDbContext();
    var user = context.Users.FirstOrDefault(u => u.Email == email);
    return user?.IsEmailVerified ?? false;
  }

  public void MarkEmailVerified(string email)
  {
    _verifiedEmails[email] = true;
    
    using var context = _contextFactory.CreateDbContext();
    var user = context.Users.FirstOrDefault(u => u.Email == email);
    if (user != null)
    {
      user.IsEmailVerified = true;
      user.UpdatedAt = DateTimeOffset.UtcNow;
      context.SaveChanges();
    }
  }

  public bool Register(string email, string password)
  {
    using var context = _contextFactory.CreateDbContext();
    
    if (context.Users.Any(u => u.Email == email)) return false;

    var salt = Guid.NewGuid().ToByteArray();

    var argon2 = new Argon2id(Encoding.UTF8.GetBytes(password))
    {
      Salt = salt,
      DegreeOfParallelism = 8,
      MemorySize = 65536,
      Iterations = 4
    };

    var hashBytes = argon2.GetBytes(32);
    var hash = Convert.ToBase64String(hashBytes);
    var saltString = Convert.ToBase64String(salt);

    var user = new User 
    { 
      Id = Guid.NewGuid(),
      Email = email,
      DisplayName = email.Split('@')[0],
      PasswordHash = $"{saltString}:{hash}",
      IsEmailVerified = true,
      CreatedAt = DateTimeOffset.UtcNow,
      UpdatedAt = DateTimeOffset.UtcNow
    };
    
    context.Users.Add(user);
    context.SaveChanges();
    
    _verifiedEmails.TryRemove(email, out _);

    Console.WriteLine($"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    Console.WriteLine($"[USER REGISTERED - SAVED TO DATABASE]");
    Console.WriteLine($"Email: {email}");
    Console.WriteLine($"UserId: {user.Id}");
    Console.WriteLine($"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    return true;
  }

  public bool ValidateCredentials(string email, string password)
  {
    using var context = _contextFactory.CreateDbContext();
    var user = context.Users.FirstOrDefault(u => u.Email == email);
    if (user == null) return false;

    var parts = user.PasswordHash.Split(':');
    if (parts.Length != 2) return false;

    var salt = Convert.FromBase64String(parts[0]);
    var storedHash = parts[1];

    var argon2 = new Argon2id(Encoding.UTF8.GetBytes(password))
    {
      Salt = salt,
      DegreeOfParallelism = 8,
      MemorySize = 65536,
      Iterations = 4
    };

    var computedHash = Convert.ToBase64String(argon2.GetBytes(32));
    return storedHash == computedHash;
  }

  public User? GetUser(string email)
  {
    using var context = _contextFactory.CreateDbContext();
    return context.Users.FirstOrDefault(u => u.Email == email);
  }
}
