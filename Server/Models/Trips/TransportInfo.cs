namespace Travel.Genie.Models.Trips
{
    public class TransportInfo
    {
        public Guid Id { get; set; }
        public Guid ItineraryItemId { get; set; }
        public string Mode { get; set; } = default!;
        public string? BookingReference { get; set; }
        public string? CarrierName { get; set; }
        public string? TransportNumber { get; set; }
        public Guid? FromPlaceId { get; set; }
        public Guid? ToPlaceId { get; set; }

        public ItineraryItem? ItineraryItem { get; set; }
        public Place? FromPlace { get; set; }
        public Place? ToPlace { get; set; }
    }
}
