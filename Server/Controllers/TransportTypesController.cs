using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Travel.Genie.Data;
using Travel.Genie.Models.Trips;

namespace Server.Controllers;

[ApiController]
[Route("api/transport-types")]
public class TransportTypesController : ControllerBase
{
    private readonly AppDbContext _db;

    public TransportTypesController(AppDbContext db)
    {
        _db = db;
    }

    public record TransportTypeCreateRequest(string Name);
    public record TransportTypeUpdateRequest(string Name);

    // GET: /api/transport-types
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TransportType>>> GetAll()
    {
        var items = await _db.TransportTypes.AsNoTracking().ToListAsync();
        return Ok(items);
    }

    // GET: /api/transport-types/{id}
    [HttpGet("{id:int}")]
    public async Task<ActionResult<TransportType>> Get(int id)
    {
        var item = await _db.TransportTypes.FindAsync(id);
        if (item == null) return NotFound();
        return Ok(item);
    }

    // POST: /api/transport-types
    [HttpPost]
    public async Task<ActionResult<TransportType>> Create([FromBody] TransportTypeCreateRequest req)
    {
        var item = new TransportType { Name = req.Name };
        _db.TransportTypes.Add(item);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(Get), new { id = item.Id }, item);
    }

    // PUT: /api/transport-types/{id}
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] TransportTypeUpdateRequest req)
    {
        var item = await _db.TransportTypes.FindAsync(id);
        if (item == null) return NotFound();

        item.Name = req.Name;
        await _db.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: /api/transport-types/{id}
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var item = await _db.TransportTypes.FindAsync(id);
        if (item == null) return NotFound();

        _db.TransportTypes.Remove(item);
        await _db.SaveChangesAsync();

        return NoContent();
    }
}
