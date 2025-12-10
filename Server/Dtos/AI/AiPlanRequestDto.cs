using Travel.Genie.Dtos.Trip;
using Travel.Genie.Dtos.User.Enums;

namespace Travel.Genie.Dtos.AI;

public sealed record AiPlanRequestDto
{
    public Guid? TripId { get; init; } // null = new trip
    public string? TripName { get; init; }
    public DateOnly? StartDate { get; init; }
    public DateOnly? EndDate { get; init; }
    public DestinationDto PrimaryDestination { get; init; } = new();
    public IReadOnlyList<DestinationDto> AdditionalDestinations { get; init; } = Array.Empty<DestinationDto>();
    public int? TravellersCount { get; init; }
    public int? ChildrenCount { get; init; }
    public BudgetLevel? BudgetLevel { get; init; }
    public PacePreference? Pace { get; init; }
    public IReadOnlyList<ActivityInterest> Interests { get; init; } = Array.Empty<ActivityInterest>();
    public string? SpecialNotes { get; init; } // "We love beach bars and hiking", etc.
}
