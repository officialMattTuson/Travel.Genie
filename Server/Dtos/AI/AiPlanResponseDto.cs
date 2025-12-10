using Travel.Genie.Dtos.Common;
using Travel.Genie.Dtos.Itinerary;

namespace Travel.Genie.Dtos.AI;

public sealed record AiPlanResponseDto
{
    public Guid ProposalId { get; init; }
    public string SuggestedTripName { get; init; } = default!;
    public TripBudgetDto? SuggestedBudget { get; init; }
    public IReadOnlyList<ItineraryDayDto> SuggestedDays { get; init; } = Array.Empty<ItineraryDayDto>();
    public IReadOnlyList<AiInsightDto> Insights { get; init; } = Array.Empty<AiInsightDto>();
}
