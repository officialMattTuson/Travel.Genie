using Microsoft.AspNetCore.Mvc;
using Travel.Genie.Models.Trips;
using Travel.Genie.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;

// Improvements needed for Controller

// 1. No Authentication
// 2. ids are doubles, should be guids
// 3. No sanitizing data from the front end 
// 4. Error handling is insufficient, too many failure types meshed into boolean return type
// 5. Database types used creating a brittle system, should use DTO's to establish contracts
// 6. No cancellation tokens
// 7. No observability

namespace Travel.Genie.Controllers;

[ApiController]
[Route("api/trips")]
[Authorize]
public sealed class TripsController : ControllerBase
{
    private readonly ITripService _tripService;
    private readonly ILogger<TripsController> _logger;

    public TripsController(ITripService tripService, ILogger<TripsController> logger)
    {
        _tripService = tripService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TripDetails>>> GetTrips(CancellationToken cancellationToken)
    {
        var userIdResult = ValidateUserClaims();
        if (userIdResult.Result != null) return userIdResult.Result;
        var userId = userIdResult.Value;
        var trips = await _tripService.GetTripsByUserIdAsync(userId, cancellationToken);
        return Ok(trips);
    }

    [HttpGet("{tripId:guid}")]
    public async Task<ActionResult<TripDetails>> GetTrip(Guid tripId, CancellationToken cancellationToken)
    {
        var userIdResult = ValidateUserClaims();
        if (userIdResult.Result != null) return userIdResult.Result;
        var userId = userIdResult.Value;

        var trip = await _tripService.GetTripByIdAsync(userId, tripId, cancellationToken);
        if (trip == null) return NotFound();
        return Ok(trip);
    }

    [HttpPost]
    public async Task<ActionResult<TripDetails>> CreateTrip([FromBody] TripDetails trip, CancellationToken cancellationToken)
    {
        var created = await _tripService.CreateTripAsync(trip, cancellationToken);
        return CreatedAtAction(nameof(GetTrip), new { tripId = created.Id }, created);
    }

    [HttpPut("{tripId:guid}")]
    public async Task<IActionResult> UpdateTrip(Guid tripId, [FromBody] TripDetails update, CancellationToken cancellationToken)
    {
        var userIdResult = ValidateUserClaims();
        if (userIdResult.Result != null) return userIdResult.Result;
        var userId = userIdResult.Value;

        var success = await _tripService.UpdateTripAsync(userId, tripId, update, cancellationToken);
        if (!success) return NotFound();
        return NoContent();
    }

    [HttpDelete("{tripId:guid}")]
    public async Task<IActionResult> DeleteTrip(Guid tripId, CancellationToken cancellationToken)
    {
        var userIdResult = ValidateUserClaims();
        if (userIdResult.Result != null) return userIdResult.Result;
        var userId = userIdResult.Value;

        var success = await _tripService.DeleteTripAsync(userId, tripId, cancellationToken);
        if (!success) return NotFound();
        return NoContent();
    }

    private ActionResult<Guid> ValidateUserClaims() 
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }
        
        if (!Guid.TryParse(userId, out var userGuid))
        {
            return BadRequest("Invalid user identifier");
        }
        
        return userGuid;
    }
}
