using Travel.Genie.Dtos.Common;
using Travel.Genie.Dtos.Itinerary.Enums;

namespace Travel.Genie.Dtos.Itinerary;

public sealed record ItineraryItemDto
{
    public Guid Id { get; init; }
    public ItineraryItemType Type { get; init; }
    public string Title { get; init; } = default!;
    public string? Description { get; init; }
    public DateTimeOffset? StartTime { get; init; }
    public DateTimeOffset? EndTime { get; init; }
    public PlaceDto? Place { get; init; }          // Where it happens (if applicable)
    public CostDto? Cost { get; init; }            // Cost info (if any)
    
    // Type-specific payloads (only one typically used, based on Type)
    public TransportInfoDto? Transport { get; init; }
    public AccommodationInfoDto? Accommodation { get; init; }
    
    public bool IsAiSuggested { get; init; }
    public bool IsUserEdited { get; init; }
}
