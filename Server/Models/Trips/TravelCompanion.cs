namespace Travel.Genie.Models.Trips
{
    public class TravelCompanion
    {
        public Guid Id { get; set; }
        public Guid TripId { get; set; }
        public required string Name { get; set; }
        public int? Age { get; set; }
        public bool IsChild { get; set; }
        public bool SharesCosts { get; set; }

        public Trip? Trip { get; set; }
    }
}
