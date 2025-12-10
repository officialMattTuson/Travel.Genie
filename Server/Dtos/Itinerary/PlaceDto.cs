namespace Travel.Genie.Dtos.Itinerary;

public sealed record PlaceDto
{
    public string Name { get; init; } = default!;
    public string? Address { get; init; }
    public double? Latitude { get; init; }
    public double? Longitude { get; init; }
    public string? GooglePlaceId { get; init; }
}
