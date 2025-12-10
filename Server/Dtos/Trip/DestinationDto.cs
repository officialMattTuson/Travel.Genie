namespace Travel.Genie.Dtos.Trip;

public sealed record DestinationDto
{
    public Guid Id { get; init; }
    public string Name { get; init; } = default!;
    public string CountryCode { get; init; } = default!; // ISO 2-letter
    public double? Latitude { get; init; }
    public double? Longitude { get; init; }
    public string? TimeZoneId { get; init; } // e.g. "Australia/Brisbane"
}
