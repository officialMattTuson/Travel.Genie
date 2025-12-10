namespace Travel.Genie.Models.Trips
{
    public class Destination
    {
        public Guid Id { get; set; }
        public required string Name { get; set; }
        public required string CountryCode { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public string? TimeZoneId { get; set; }

        // Navigation
        // Many-to-many: Trip -> Destination (via TripDestinations join table)
        public ICollection<Trip> Trips { get; set; } = new List<Trip>();
        
        // One-to-many: Destination -> Place
        public ICollection<Place> Places { get; set; } = new List<Place>();
    }
}
