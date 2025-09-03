namespace Server.Models.Authentication
{
  public class User
  {
    public double Id { get; set; }
    public required string Email { get; set; }
    public required string PasswordHash { get; set; }
    public bool IsEmailVerified { get; set; }
  }
}