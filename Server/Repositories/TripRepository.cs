using Microsoft.EntityFrameworkCore;
using Travel.Genie.Data;
using Travel.Genie.Models.Trips;
using Travel.Genie.Repositories.Interfaces;

namespace Travel.Genie.Repositories
{
    public class TripRepository : ITripRepository
    {
        private readonly IDbContextFactory<AppDbContext> _contextFactory;

        public TripRepository(IDbContextFactory<AppDbContext> contextFactory)
        {
            _contextFactory = contextFactory;
        }

        public async Task<IEnumerable<TripDetails>> GetAllAsync()
        {
            using var db = await _contextFactory.CreateDbContextAsync();
            return await db.TripDetails.AsNoTracking().ToListAsync();
        }

        public async Task<TripDetails?> GetByIdAsync(double id)
        {
            using var db = await _contextFactory.CreateDbContextAsync();
            return await db.TripDetails.FindAsync(id);
        }

        public async Task<TripDetails> AddAsync(TripDetails trip)
        {
            using var db = await _contextFactory.CreateDbContextAsync();
            db.TripDetails.Add(trip);
            await db.SaveChangesAsync();
            return trip;
        }

        public async Task UpdateAsync(TripDetails trip)
        {
            using var db = await _contextFactory.CreateDbContextAsync();
            db.TripDetails.Update(trip);
            await db.SaveChangesAsync();
        }

        public async Task DeleteAsync(TripDetails trip)
        {
            using var db = await _contextFactory.CreateDbContextAsync();
            db.TripDetails.Remove(trip);
            await db.SaveChangesAsync();
        }

        public async Task<bool> ExistsAsync(double id)
        {
            using var db = await _contextFactory.CreateDbContextAsync();
            return await db.TripDetails.AnyAsync(t => t.Id == id);
        }
    }
}