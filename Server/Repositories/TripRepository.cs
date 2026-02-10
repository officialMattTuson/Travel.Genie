using Microsoft.EntityFrameworkCore;
using Travel.Genie.Data;
using Travel.Genie.Dtos.Trip;
using Travel.Genie.Mappers;
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

        public async Task<IReadOnlyList<TripDetailDto>> GetAllAsync(CancellationToken cancellationToken)
        {
            using var db = await _contextFactory.CreateDbContextAsync();
            var trips = await db.Trips
                .Include(t => t.PrimaryDestination)
                .Include(t => t.Destinations)
                .Include(t => t.Budget)
                .Include(t => t.Companions)
                .Include(t => t.ItineraryDays)
                    .ThenInclude(d => d.Items)
                        .ThenInclude(i => i.Place)
                .Include(t => t.ItineraryDays)
                    .ThenInclude(d => d.Items)
                        .ThenInclude(i => i.Cost)
                .Include(t => t.ItineraryDays)
                    .ThenInclude(d => d.Items)
                        .ThenInclude(i => i.Transport)
                .Include(t => t.ItineraryDays)
                    .ThenInclude(d => d.Items)
                        .ThenInclude(i => i.Accommodation)
                .AsNoTracking()
                .ToListAsync(cancellationToken); 
            return trips.Select(t => t.ToDto()).ToList();
        }

        public async Task<IReadOnlyList<TripDetailDto>> GetTripDtosByUserIdAsync(Guid userId, CancellationToken cancellationToken)
        {
            using var db = await _contextFactory.CreateDbContextAsync();
            var trips = await db.Trips
                .Include(t => t.PrimaryDestination)
                .Include(t => t.Destinations)
                .Include(t => t.Budget)
                .Include(t => t.Companions)
                .Include(t => t.ItineraryDays)
                    .ThenInclude(d => d.Items)
                        .ThenInclude(i => i.Place)
                .Include(t => t.ItineraryDays)
                    .ThenInclude(d => d.Items)
                        .ThenInclude(i => i.Cost)
                .Include(t => t.ItineraryDays)
                    .ThenInclude(d => d.Items)
                        .ThenInclude(i => i.Transport)
                .Include(t => t.ItineraryDays)
                    .ThenInclude(d => d.Items)
                        .ThenInclude(i => i.Accommodation)
                .AsNoTracking()
                .Where(t => t.UserId == userId)
                .ToListAsync(cancellationToken);
            
            return trips.Select(t => t.ToDto()).ToList();
        }
    
        public async Task<Trip?> GetByIdAsync(Guid userId, Guid tripId, CancellationToken cancellationToken) 
        {
            using var db = await _contextFactory.CreateDbContextAsync();
            return await db.Trips
                .Include(t => t.PrimaryDestination)
                .Include(t => t.Destinations)
                .Include(t => t.Budget)
                .Include(t => t.Companions)
                .Include(t => t.ItineraryDays)
                    .ThenInclude(d => d.Items)
                        .ThenInclude(i => i.Place)
                .Include(t => t.ItineraryDays)
                    .ThenInclude(d => d.Items)
                        .ThenInclude(i => i.Cost)
                .Include(t => t.ItineraryDays)
                    .ThenInclude(d => d.Items)
                        .ThenInclude(i => i.Transport)
                .Include(t => t.ItineraryDays)
                    .ThenInclude(d => d.Items)
                        .ThenInclude(i => i.Accommodation)
                .AsNoTracking()
                .FirstOrDefaultAsync(t => t.Id == tripId && t.UserId == userId, cancellationToken);
        }

        public async Task<Trip> AddAsync(Trip trip, CancellationToken cancellationToken)
        {
            using var db = await _contextFactory.CreateDbContextAsync();
            db.Trips.Add(trip);
            await db.SaveChangesAsync(cancellationToken);
            return trip;
        }

        public async Task<bool> UpdateAsync(Guid userId, Guid tripId, Trip update, CancellationToken cancellationToken)
        {
            using var db = await _contextFactory.CreateDbContextAsync();
            var existing = await db.Trips
                .FirstOrDefaultAsync(t => t.Id == tripId && t.UserId == userId, cancellationToken);
            
            if (existing == null) return false;

            existing.Name = update.Name;
            existing.Description = update.Description;
            existing.StartDate = update.StartDate;
            existing.EndDate = update.EndDate;
            existing.Status = update.Status;
            existing.UpdatedAt = DateTimeOffset.UtcNow;

            await db.SaveChangesAsync(cancellationToken);
            return true;
        }

        public async Task<bool> DeleteAsync(Guid userId, Guid tripId, CancellationToken cancellationToken)
        {
            using var db = await _contextFactory.CreateDbContextAsync();
            var trip = await db.Trips
                .FirstOrDefaultAsync(t => t.Id == tripId && t.UserId == userId, cancellationToken);
            
            if (trip == null) return false;

            db.Trips.Remove(trip);
            await db.SaveChangesAsync(cancellationToken);
            return true;
        }

        public async Task<bool> ExistsAsync(Guid userId, Guid tripId, CancellationToken cancellationToken)
        {
            using var db = await _contextFactory.CreateDbContextAsync();
            return await db.Trips.AnyAsync(t => t.Id == tripId && t.UserId == userId, cancellationToken);
        }
    }
}