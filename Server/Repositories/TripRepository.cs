using Microsoft.EntityFrameworkCore;
using Travel.Genie.Data;
using Travel.Genie.Models.Trips;
using Travel.Genie.Repositories.Interfaces;

namespace Travel.Genie.Repositories
{
    public class TripRepository : ITripRepository
    {
        private readonly AppDbContext _db;

        public TripRepository(AppDbContext db)
        {
            _db = db;
        }

        public async Task<IEnumerable<TripDetails>> GetAllAsync() =>
            await _db.TripDetails.AsNoTracking().ToListAsync();

        public async Task<TripDetails?> GetByIdAsync(double id) =>
            await _db.TripDetails.FindAsync(id);

        public async Task<TripDetails> AddAsync(TripDetails trip)
        {
            _db.TripDetails.Add(trip);
            await _db.SaveChangesAsync();
            return trip;
        }

        public async Task UpdateAsync(TripDetails trip)
        {
            _db.TripDetails.Update(trip);
            await _db.SaveChangesAsync();
        }

        public async Task DeleteAsync(TripDetails trip)
        {
            _db.TripDetails.Remove(trip);
            await _db.SaveChangesAsync();
        }

        public async Task<bool> ExistsAsync(double id) =>
            await _db.TripDetails.AnyAsync(t => t.Id == id);
    }
}