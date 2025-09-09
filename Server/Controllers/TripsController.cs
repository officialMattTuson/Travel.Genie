using Microsoft.AspNetCore.Mvc;
using Travel.Genie.Models.Trips;
using Travel.Genie.Services.Interfaces;

namespace Travel.Genie.Controllers
{
    [ApiController]
    [Route("api/trips")]
    public class TripsController : ControllerBase
    {
        private readonly ITripService _service;

        public TripsController(ITripService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TripDetails>>> GetTrips()
        {
            var trips = await _service.GetTripsAsync();
            return Ok(trips);
        }

        [HttpGet("{id:double}")]
        public async Task<ActionResult<TripDetails>> GetTrip(double id)
        {
            var trip = await _service.GetTripByIdAsync(id);
            if (trip == null) return NotFound();
            return Ok(trip);
        }

        [HttpPost]
        public async Task<ActionResult<TripDetails>> CreateTrip([FromBody] TripDetails trip)
        {
            var created = await _service.CreateTripAsync(trip);
            return CreatedAtAction(nameof(GetTrip), new { id = created.Id }, created);
        }

        [HttpPut("{id:double}")]
        public async Task<IActionResult> UpdateTrip(double id, [FromBody] TripDetails update)
        {
            var success = await _service.UpdateTripAsync(id, update);
            if (!success) return NotFound();
            return NoContent();
        }

        [HttpDelete("{id:double}")]
        public async Task<IActionResult> DeleteTrip(double id)
        {
            var success = await _service.DeleteTripAsync(id);
            if (!success) return NotFound();
            return NoContent();
        }
    }
}