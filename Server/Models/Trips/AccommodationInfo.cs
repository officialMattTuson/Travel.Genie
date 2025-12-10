namespace Travel.Genie.Models.Trips
{
    public class AccommodationInfo
    {
        public Guid Id { get; set; }
        public Guid ItineraryItemId { get; set; }
        public required string ProviderName { get; set; }
        public string? ProviderType { get; set; }
        public DateOnly CheckInDate { get; set; }
        public DateOnly CheckOutDate { get; set; }
        public string? BookingReference { get; set; }
        public string? BookingPlatform { get; set; }
        public Guid? LocationId { get; set; }

        public ItineraryItem? ItineraryItem { get; set; }
        public Place? Location { get; set; }
    }
}
