using Travel.Genie.Models.Authentication;

namespace Travel.Genie.Models.Trips
{
    public class Trip
    {
        public Guid Id { get; set; }
        public required string Name { get; set; }
        public string? Description { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }
        public string Status { get; set; } = "Draft";
        public Guid UserId { get; set; }
        public DateTimeOffset CreatedAt { get; set; }
        public DateTimeOffset UpdatedAt { get; set; }
        public bool HasAiGeneratedPlan { get; set; }
        public DateTimeOffset? LastAiPlanUpdatedAt { get; set; }

        // Foreign keys and navigation
        public Guid PrimaryDestinationId { get; set; }
        public Destination PrimaryDestination { get; set; } = null!;
        
        public User? User { get; set; }
        public ICollection<Destination> Destinations { get; set; } = new List<Destination>();
        public ICollection<TravelCompanion> Companions { get; set; } = new List<TravelCompanion>();
        public ICollection<ItineraryDay> ItineraryDays { get; set; } = new List<ItineraryDay>();
        public TripBudget? Budget { get; set; }
    }
}
