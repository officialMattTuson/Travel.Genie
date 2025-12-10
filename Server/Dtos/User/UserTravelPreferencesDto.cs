using Travel.Genie.Dtos.User.Enums;

namespace Travel.Genie.Dtos.User;

public sealed record UserTravelPreferencesDto
{
    public TravelStyle TravelStyle { get; init; } = TravelStyle.Balanced;
    public BudgetLevel BudgetLevel { get; init; } = BudgetLevel.MidRange;
    public PacePreference Pace { get; init; } = PacePreference.Moderate;
    public IReadOnlyList<ActivityInterest> Interests { get; init; } = Array.Empty<ActivityInterest>();
    public bool PrefersWalkableAreas { get; init; }
    public bool PrefersPublicTransport { get; init; }
    public bool PrefersNightlife { get; init; }
}
