using Microsoft.AspNetCore.Mvc;
using Travel.Genie.Dtos.TripPlanner;
using Travel.Genie.Services.Interfaces;

namespace Travel.Genie.Controllers;

[ApiController]
[Route("api/trip-planner")]
public class TripPlannerController : ControllerBase
{
    private readonly IAiTripPlannerService _aiPlannerService;
    private readonly ILogger<TripPlannerController> _logger;

    public TripPlannerController(
        IAiTripPlannerService aiPlannerService,
        ILogger<TripPlannerController> logger)
    {
        _aiPlannerService = aiPlannerService;
        _logger = logger;
    }

    /// <summary>
    /// Generates an AI-powered trip plan based on user constraints and preferences.
    /// </summary>
    /// <param name="request">Trip planning parameters.</param>
    /// <param name="ct">Cancellation token.</param>
    /// <returns>Generated trip plan with itinerary, budget breakdown, and insights.</returns>
    [HttpPost("generate")]
    public async Task<ActionResult<GeneratedTripPlanResponse>> GeneratePlan(
        [FromBody] GenerateTripPlanRequest request,
        CancellationToken ct)
    {
        if (!ModelState.IsValid)
        {
            _logger.LogWarning("Invalid trip plan request: {Errors}", ModelState.Values.SelectMany(v => v.Errors));
            return BadRequest(ModelState);
        }

        try
        {
            var plan = await _aiPlannerService.GeneratePlanAsync(request, ct);
            return Ok(plan);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating trip plan for destination {Destination}",
               request.Destination?.Replace("\r", "").Replace("\n", ""));
            return StatusCode(
                StatusCodes.Status500InternalServerError,
                new { message = "Failed to generate trip plan. Please try again." });
        }
    }
}
