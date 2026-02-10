using Travel.Genie.Dtos.Itinerary;

namespace Travel.Genie.Dtos.Trip;

public sealed record TripDetailDto
{
    public Guid Id { get; init; }
    public string Name { get; init; } = default!;
    public string? Description { get; init; }
    public string StartDate { get; init; } = default!;
    public string EndDate { get; init; } = default!;
    public string Status { get; init; } = default!;
    public DestinationDto PrimaryDestination { get; init; } = default!;
    public IReadOnlyList<DestinationDto> Destinations { get; init; } = Array.Empty<DestinationDto>();
    public TripBudgetDto? Budget { get; init; }
    public IReadOnlyList<TravelCompanionDto> Companions { get; init; } = Array.Empty<TravelCompanionDto>();
    public IReadOnlyList<ItineraryDayDto> ItineraryDays { get; init; } = Array.Empty<ItineraryDayDto>();
    public bool HasAiGeneratedPlan { get; init; }
    public string? LastAiPlanUpdatedAt { get; init; }
}
