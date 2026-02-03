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
        private readonly AppDbContext _db;

        public TripRepository(AppDbContext db)
        {
            _db = db;
        }

        public async Task<IEnumerable<TripDetails>> GetAllAsync(CancellationToken cancellationToken)
        {
            return await _db.TripDetails.AsNoTracking().ToListAsync(cancellationToken);
        }

        public async Task<IReadOnlyList<TripDetailDto>> GetTripDtosByUserIdAsync(Guid userId, CancellationToken cancellationToken)
        {
            var trips = await _db.TripDetails
                .AsNoTracking()
                .Where(t => t.UserId == userId)
                .ToListAsync(cancellationToken);
            
            return trips.Select(t => t.ToDto()).ToList();
        }

        public async Task<TripDetails?> GetByIdAsync(Guid userId, Guid tripId, CancellationToken cancellationToken) 
        {
            return await _db.TripDetails
                .AsNoTracking()
                .FirstOrDefaultAsync(t => t.Id == tripId && t.UserId == userId, cancellationToken);
        }

        public async Task<TripDetails> AddAsync(TripDetails trip, CancellationToken cancellationToken)
        {
            _db.TripDetails.Add(trip);
            await _db.SaveChangesAsync(cancellationToken);
            return trip;
        }

        public async Task<bool> UpdateAsync(Guid userId, Guid tripId, TripDetails update, CancellationToken cancellationToken)
        {
            var existing = await _db.TripDetails
                .FirstOrDefaultAsync(t => t.Id == tripId && t.UserId == userId, cancellationToken);
            
            if (existing == null) return false;

            existing.Destination = update.Destination;
            existing.StartDate = update.StartDate;
            existing.EndDate = update.EndDate;
            existing.Status = update.Status;
            existing.CurrencyCode = update.CurrencyCode;
            existing.BudgetedPrice = update.BudgetedPrice;
            existing.KeepToBudget = update.KeepToBudget;
            existing.ActualPrice = update.ActualPrice;
            existing.Itinerary = update.Itinerary;
            existing.TripType = update.TripType;
            existing.TransportTypes = update.TransportTypes;
            existing.UpdatedAt = DateTimeOffset.UtcNow;

            await _db.SaveChangesAsync(cancellationToken);
            return true;
        }

        public async Task<bool> DeleteAsync(Guid userId, Guid tripId, CancellationToken cancellationToken)
        {
            var trip = await _db.TripDetails
                .FirstOrDefaultAsync(t => t.Id == tripId && t.UserId == userId, cancellationToken);
            
            if (trip == null) return false;

            _db.TripDetails.Remove(trip);
            await _db.SaveChangesAsync(cancellationToken);
            return true;
        }

        public async Task<bool> ExistsAsync(Guid userId, Guid tripId, CancellationToken cancellationToken) =>
            await _db.TripDetails.AnyAsync(t => t.Id == tripId && t.UserId == userId, cancellationToken);
    }
}