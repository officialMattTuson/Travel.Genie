using Travel.Genie.Dtos.TripPlanner;

namespace Travel.Genie.Services.Interfaces;

public interface IAiTripPlannerService
{
    /// <summary>
    /// Generates a trip plan based on user constraints and preferences.
    /// </summary>
    /// <param name="request">Trip planning constraints (destination, dates, budget, preferences).</param>
    /// <param name="ct">Cancellation token.</param>
    /// <returns>Generated trip plan with itinerary, budget breakdown, and AI notes.</returns>
    Task<GeneratedTripPlanResponse> GeneratePlanAsync(
        GenerateTripPlanRequest request,
        CancellationToken ct = default);
}
