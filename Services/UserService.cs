using System.Text;
using System.Collections.Concurrent;
using Travel.Genie.Models;
using Konscious.Security.Cryptography;

namespace Travel.Genie.Services;

public class UserService
{
  private readonly ConcurrentDictionary<string, User> _users = new();
  private readonly HashSet<string> _verifiedEmails = new();

  public bool IsEmailVerified(string email) => _verifiedEmails.Contains(email);

  public void MarkEmailVerified(string email)
  {
    _verifiedEmails.Add(email);
  }

  public bool Register(string email, string username, string password)
  {
    if (_users.ContainsKey(email)) return false;

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

    var user = new User { Email = email, Username = username, PasswordHash = $"{saltString}:{hash}" };
    _users[email] = user;

    return true;
  }

  public bool ValidateCredentials(string email, string password)
  {
    if (!_users.TryGetValue(email, out var user)) return false;

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

  public User? GetUser(string email) =>
      _users.TryGetValue(email, out var user) ? user : null;
}
