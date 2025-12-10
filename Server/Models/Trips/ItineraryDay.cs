namespace Travel.Genie.Models.Trips
{
    public class ItineraryDay
    {
        public Guid Id { get; set; }
        public Guid TripId { get; set; }
        public DateOnly Date { get; set; }
        public int DayNumber { get; set; }
        public string? Summary { get; set; }

        public Trip? Trip { get; set; }
        public ICollection<ItineraryItem> Items { get; set; } = new List<ItineraryItem>();
    }
}
