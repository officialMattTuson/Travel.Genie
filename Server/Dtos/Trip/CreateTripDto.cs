namespace Travel.Genie.Dtos.Trip;

public sealed record CreateTripDto
{
    public string Name { get; init; } = default!;
    public string? Description { get; init; }
    public string PrimaryDestination { get; init; } = default!; // e.g. "Tokyo, Japan"
    public string[] OtherDestinations { get; init; } = Array.Empty<string>();
    public DateOnly StartDate { get; init; }
    public DateOnly EndDate { get; init; }
    public string Status { get; init; } = "Draft";
    public TripBudgetDto? Budget { get; init; }
    public TravelCompanionDto[] Companions { get; init; } = Array.Empty<TravelCompanionDto>();
}
