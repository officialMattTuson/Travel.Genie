namespace Travel.Genie.Dtos.Itinerary;

public sealed record AccommodationInfoDto
{
    public string ProviderName { get; init; } = default!;   // e.g. "YHA Byron Bay"
    public string? ProviderType { get; init; }             // hostel/hotel/airbnb
    public PlaceDto Location { get; init; } = new();
    public DateOnly CheckInDate { get; init; }
    public DateOnly CheckOutDate { get; init; }
    public string? BookingReference { get; init; }
    public string? BookingPlatform { get; init; } // "Booking.com", "Airbnb"
}
