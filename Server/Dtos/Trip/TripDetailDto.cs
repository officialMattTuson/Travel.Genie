using Travel.Genie.Models.Trips;

namespace Travel.Genie.Dtos.Trip;

public sealed record TripDetailDto
{
    public string Destination { get; init; } = default!;
    public DateTimeOffset StartDate { get; init; }
    public DateTimeOffset EndDate { get; init; }
    public DateTimeOffset CreatedAt { get; init; }
    public DateTimeOffset UpdatedAt { get; init; }
    public string Status { get; init; } = default!;
    public string CurrencyCode { get; init; } = default!;
    public decimal BudgetedPrice { get; init; }
    public bool KeepToBudget { get; init; }
    public decimal ActualPrice { get; init; }
    public ItineraryType Itinerary { get; init; } = default!;
    public TripType TripType { get; init; } = default!;
    public IReadOnlyList<TransportType> TransportTypes { get; init; } = Array.Empty<TransportType>();
}
