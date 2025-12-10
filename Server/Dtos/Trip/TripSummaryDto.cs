using Travel.Genie.Dtos.Trip.Enums;

namespace Travel.Genie.Dtos.Trip;

public sealed record TripSummaryDto
{
    public Guid Id { get; init; }
    public string Name { get; init; } = default!;
    public DateOnly StartDate { get; init; }
    public DateOnly EndDate { get; init; }
    public string PrimaryDestinationName { get; init; } = default!;
    public string? CoverImageUrl { get; init; }
    public TripStatus Status { get; init; }
    public int DayCount { get; init; }
    public int PlannedItemsCount { get; init; }
}
