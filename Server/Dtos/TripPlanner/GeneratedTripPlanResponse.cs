namespace Travel.Genie.Dtos.TripPlanner;

public sealed class AttractionDto
{
    public required string Name { get; set; }
    public required string Description { get; set; }
    public string? Category { get; set; }
    public decimal? EstimatedCost { get; set; }
}

public sealed class RestaurantDto
{
    public required string Name { get; set; }
    public required string Cuisine { get; set; }
    public required string Description { get; set; }
    public string? Specialty { get; set; }
    public decimal? EstimatedCost { get; set; }
}

public sealed class BudgetBreakdownDto
{
    public decimal Total { get; set; }
    public decimal Accommodation { get; set; }
    public decimal Food { get; set; }
    public decimal Activities { get; set; }
    public decimal Transport { get; set; }
    public decimal Other { get; set; }
}

public sealed class TripDraftDto
{
    public required string Name { get; set; }
    public required string Description { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public required string Destination { get; set; }
}

public sealed class GeneratedTripPlanResponse
{
    public required TripDraftDto Trip { get; set; }
    public List<AttractionDto> Attractions { get; set; } = [];
    public List<RestaurantDto> Restaurants { get; set; } = [];
    public required BudgetBreakdownDto Budget { get; set; }
    public List<string> AiNotes { get; set; } = [];
}
