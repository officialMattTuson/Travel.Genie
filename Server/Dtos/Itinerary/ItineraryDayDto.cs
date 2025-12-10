namespace Travel.Genie.Dtos.Itinerary;

public sealed record ItineraryDayDto
{
    public Guid Id { get; init; }
    public DateOnly Date { get; init; }
    public int DayNumber { get; init; } // 1-based within trip
    public string? Summary { get; init; }          // Human summary (or AI generated)
    public IReadOnlyList<ItineraryItemDto> Items { get; init; } = Array.Empty<ItineraryItemDto>();
}
