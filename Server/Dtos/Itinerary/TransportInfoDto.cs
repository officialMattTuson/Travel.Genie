using Travel.Genie.Dtos.Itinerary.Enums;

namespace Travel.Genie.Dtos.Itinerary;

public sealed record TransportInfoDto
{
    public TransportMode Mode { get; init; }
    public PlaceDto From { get; init; } = new();
    public PlaceDto To { get; init; } = new();
    public string? BookingReference { get; init; }
    public string? CarrierName { get; init; }  // airline/bus/train
    public string? TransportNumber { get; init; } // flight number, etc.
}
