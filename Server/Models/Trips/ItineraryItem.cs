namespace Travel.Genie.Models.Trips
{
    public class ItineraryItem
    {
        public Guid Id { get; set; }
        public Guid ItineraryDayId { get; set; }
        public string Type { get; set; } = default!;
        public required string Title { get; set; }
        public string? Description { get; set; }
        public DateTimeOffset? StartTime { get; set; }
        public DateTimeOffset? EndTime { get; set; }
        public Guid? PlaceId { get; set; }
        public bool IsAiSuggested { get; set; }
        public bool IsUserEdited { get; set; }

        public ItineraryDay? ItineraryDay { get; set; }
        public Place? Place { get; set; }
        public Cost? Cost { get; set; }
        public TransportInfo? Transport { get; set; }
        public AccommodationInfo? Accommodation { get; set; }
    }
}
