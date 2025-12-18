namespace Travel.Genie.Dtos.TripPlanner;

public sealed class GenerateTripPlanRequest
{
    public Guid? TripId { get; set; }
    public required string Destination { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public required decimal Budget { get; set; }
    public required string Currency { get; set; } = "USD";
    public List<string> PreferenceTags { get; set; } = [];
    public required string UserId { get; set; }
}
