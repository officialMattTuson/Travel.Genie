using Travel.Genie.Dtos.Common;
using Travel.Genie.Dtos.Itinerary;
using Travel.Genie.Dtos.Trip.Enums;

namespace Travel.Genie.Dtos.Trip;

public sealed record TripDetailDto
{
    public Guid Id { get; init; }
    public string Name { get; init; } = default!;
    public string? Description { get; init; }
    public DateOnly StartDate { get; init; }
    public DateOnly EndDate { get; init; }
    public TripStatus Status { get; init; }
    public DestinationDto PrimaryDestination { get; init; } = new();
    public IReadOnlyList<DestinationDto> Destinations { get; init; } = Array.Empty<DestinationDto>();
    public TripBudgetDto? Budget { get; init; }
    public IReadOnlyList<TravelCompanionDto> Companions { get; init; } = Array.Empty<TravelCompanionDto>();
    public IReadOnlyList<ItineraryDayDto> ItineraryDays { get; init; } = Array.Empty<ItineraryDayDto>();
    
    // AI-related metadata
    public bool HasAiGeneratedPlan { get; init; }
    public DateTimeOffset? LastAiPlanUpdatedAt { get; init; }
}
