using Microsoft.AspNetCore.Mvc;
using Travel.Genie.Models.Trips;
using Travel.Genie.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using Travel.Genie.Dtos.Common;
using Travel.Genie.Dtos.Trip;
using Travel.Genie.Mappers;

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
    public async Task<ActionResult<PagedResultDto<TripDetailDto>>> GetTrips(
        [FromQuery] int pageNumber = 1, 
        [FromQuery] int pageSize = 10, 
        CancellationToken cancellationToken = default)
    {
        var userIdResult = ValidateUserClaims();
        if (userIdResult.Result != null) return userIdResult.Result;
        var userId = userIdResult.Value;
        _logger.LogInformation($"User Id: {userId}");
        var trips = await _tripService.GetTripsAsync(cancellationToken);
        _logger.LogInformation($"Trips: {trips.Count()}");
        var allTrips = await _tripService.GetTripsByUserIdAsync(userId, cancellationToken);
        var totalCount = allTrips.Count;
        
        var items = allTrips
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToList();
        
        var pagedResult = new PagedResultDto<TripDetailDto>
        {
            Items = items,
            PageNumber = pageNumber,
            PageSize = pageSize,
            TotalCount = totalCount
        };
        
        return Ok(pagedResult);
    }

    [HttpGet("{tripId:guid}")]
    public async Task<ActionResult<Trip>> GetTrip(Guid tripId, CancellationToken cancellationToken)
    {
        var userIdResult = ValidateUserClaims();
        if (userIdResult.Result != null) return userIdResult.Result;
        var userId = userIdResult.Value;

        var trip = await _tripService.GetTripByIdAsync(userId, tripId, cancellationToken);
        if (trip == null) return NotFound();
        return Ok(trip);
    }

    [HttpPost]
    public async Task<ActionResult<TripDetailDto>> CreateTrip([FromBody] CreateTripDto dto, CancellationToken cancellationToken)
    {
        var userIdResult = ValidateUserClaims();
        if (userIdResult.Result != null) return userIdResult.Result;
        var userId = userIdResult.Value;
        
        // Create primary destination
        var primaryDestination = new Destination
        {
            Id = Guid.NewGuid(),
            Name = dto.PrimaryDestination,
            CountryCode = ExtractCountryCode(dto.PrimaryDestination)
        };
        
        // Create other destinations
        var otherDestinations = dto.OtherDestinations
            .Select(d => new Destination
            {
                Id = Guid.NewGuid(),
                Name = d,
                CountryCode = ExtractCountryCode(d)
            })
            .ToList();
        
        // Create companions
        var companions = dto.Companions
            .Select(c => new TravelCompanion
            {
                Id = Guid.NewGuid(),
                Name = c.Name,
                Age = c.Age,
                IsChild = c.IsChild,
                SharesCosts = c.SharesCosts
            })
            .ToList();
        
        // Create budget if provided
        TripBudget? budget = null;
        if (dto.Budget != null)
        {
            budget = new TripBudget
            {
                Id = Guid.NewGuid(),
                CurrencyCode = dto.Budget.CurrencyCode,
                TotalBudget = dto.Budget.TotalBudget,
                DailyTarget = dto.Budget.DailyTarget
            };
        }
        
        // Build trip
        var trip = new Trip
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Name = dto.Name,
            Description = dto.Description,
            StartDate = dto.StartDate,
            EndDate = dto.EndDate,
            Status = dto.Status,
            PrimaryDestination = primaryDestination,
            PrimaryDestinationId = primaryDestination.Id,
            Destinations = otherDestinations,
            Companions = companions,
            Budget = budget,
            CreatedAt = DateTimeOffset.UtcNow,
            UpdatedAt = DateTimeOffset.UtcNow,
            HasAiGeneratedPlan = false
        };
        
        var created = await _tripService.CreateTripAsync(trip, cancellationToken);
        return CreatedAtAction(nameof(GetTrip), new { tripId = created.Id }, created.ToDto());
    }
    
    private static string ExtractCountryCode(string destination)
    {
        // Simple extraction - takes last part after comma
        var parts = destination.Split(',');
        if (parts.Length > 1)
        {
            var country = parts[^1].Trim();
            // Map common countries to ISO codes (expand as needed)
            return country.ToLower() switch
            {
                "japan" => "JP",
                "france" => "FR",
                "usa" or "united states" => "US",
                "uk" or "united kingdom" => "GB",
                "australia" => "AU",
                "germany" => "DE",
                "italy" => "IT",
                "spain" => "ES",
                _ => "XX" // Unknown
            };
        }
        return "XX";
    }

    [HttpPut("{tripId:guid}")]
    public async Task<IActionResult> UpdateTrip(Guid tripId, [FromBody] Trip update, CancellationToken cancellationToken)
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
        _logger.LogInformation("Claims in token:");
        foreach (var claim in User.Claims)
        {
            _logger.LogInformation("  {Type}: {Value}", claim.Type, claim.Value);
        }
        
        var allNameIdentifiers = User.FindAll(ClaimTypes.NameIdentifier).ToList();
        var userId = allNameIdentifiers.FirstOrDefault(c => Guid.TryParse(c.Value, out _))?.Value;
        
        _logger.LogInformation("Selected userId: {UserId}", userId ?? "NULL");
        
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }
        
        if (!Guid.TryParse(userId, out var userGuid))
        {
            _logger.LogError("Failed to parse userId '{UserId}' as Guid", userId);
            return BadRequest("Invalid user identifier");
        }
        
        return userGuid;
    }
}
