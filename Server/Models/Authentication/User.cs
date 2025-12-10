namespace Travel.Genie.Models.Authentication
{
    public class User
    {
        public Guid Id { get; set; }
        public required string Email { get; set; }
        public string DisplayName { get; set; } = default!;
        public string? HomeCity { get; set; }
        public string? HomeCountryCode { get; set; }
        public required string PasswordHash { get; set; }
        public bool IsEmailVerified { get; set; }
        public DateTimeOffset CreatedAt { get; set; }
        public DateTimeOffset UpdatedAt { get; set; }

        // Navigation property
        public ICollection<Trip> Trips { get; set; } = new List<Trip>();
    }
}