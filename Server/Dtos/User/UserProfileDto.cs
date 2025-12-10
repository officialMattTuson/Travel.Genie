namespace Travel.Genie.Dtos.User;

public sealed record UserProfileDto
{
    public Guid Id { get; init; }
    public string Email { get; init; } = default!;
    public string DisplayName { get; init; } = default!;
    public string? HomeCity { get; init; }
    public string? HomeCountryCode { get; init; } // ISO 2-letter
    public UserTravelPreferencesDto Preferences { get; init; } = new();
}
