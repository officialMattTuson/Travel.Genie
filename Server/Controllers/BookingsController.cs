using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Travel.Genie.Data;
using Travel.Genie.Models.Trips;

namespace Server.Controllers;

[ApiController]
[Route("api/bookings")]
public class BookingsController : ControllerBase
{
    private readonly AppDbContext _db;

    public BookingsController(AppDbContext db)
    {
        _db = db;
    }

    public record BookingCreateRequest(Guid TripId, Guid UserId, BookingType BookingType);
    public record BookingUpdateRequest(Guid TripId, Guid UserId, BookingType BookingType);

    // GET: /api/bookings
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Booking>>> GetAll()
    {
        var items = await _db.Bookings.AsNoTracking().ToListAsync();
        return Ok(items);
    }

    // GET: /api/bookings/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<Booking>> Get(string id)
    {
        var booking = await _db.Bookings.FindAsync(id);
        if (booking == null) return NotFound();
        return Ok(booking);
    }

    // POST: /api/bookings
    [HttpPost]
    public async Task<ActionResult<Booking>> Create([FromBody] BookingCreateRequest req)
    {
        var booking = new Booking
        {
            Id = Guid.NewGuid().ToString("N"),
            TripId = req.TripId,
            UserId = req.UserId,
            BookingType = req.BookingType,
            CreatedAt = DateTimeOffset.UtcNow,
            UpdatedAt = DateTimeOffset.UtcNow
        };

        _db.Bookings.Add(booking);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(Get), new { id = booking.Id }, booking);
    }

    // PUT: /api/bookings/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] BookingUpdateRequest req)
    {
        var booking = await _db.Bookings.FindAsync(id);
        if (booking == null) return NotFound();

        booking.TripId = req.TripId;
        booking.UserId = req.UserId;
        booking.BookingType = req.BookingType;
        booking.UpdatedAt = DateTimeOffset.UtcNow;

        await _db.SaveChangesAsync();
        return NoContent();
    }

    // DELETE: /api/bookings/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var booking = await _db.Bookings.FindAsync(id);
        if (booking == null) return NotFound();

        _db.Bookings.Remove(booking);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
