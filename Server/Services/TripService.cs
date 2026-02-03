using Travel.Genie.Models.Trips;
using Travel.Genie.Repositories.Interfaces;
using Travel.Genie.Services.Interfaces;

namespace Travel.Genie.Services
{
    public class TripService : ITripService
    {
        private readonly ITripRepository _repo;

        public TripService(ITripRepository repo)
        {
            _repo = repo;
        }

        public async Task<IEnumerable<TripDetails>> GetTripsAsync() =>
            await _repo.GetAllAsync();

        public async Task<TripDetails?> GetTripByIdAsync(double id) =>
            await _repo.GetByIdAsync(id);

        public async Task<TripDetails> CreateTripAsync(TripDetails trip)
        {
            var now = DateTimeOffset.UtcNow;
            trip.CreatedAt = now;
            trip.UpdatedAt = now;
            return await _repo.AddAsync(trip);
        }

        public async Task<bool> UpdateTripAsync(double id, TripDetails update)
        {
            var existing = await _repo.GetByIdAsync(id);
            if (existing == null) return false;

            existing.Destination = update.Destination;
            existing.StartDate = update.StartDate;
            existing.EndDate = update.EndDate;
            existing.UserId = update.UserId;
            existing.Status = update.Status;
            existing.CurrencyCode = update.CurrencyCode;
            existing.BudgetedPrice = update.BudgetedPrice;
            existing.KeepToBudget = update.KeepToBudget;
            existing.ActualPrice = update.ActualPrice;
            existing.Itinerary = update.Itinerary;
            existing.TripType = update.TripType;
            existing.UpdatedAt = DateTimeOffset.UtcNow;

            await _repo.UpdateAsync(existing);
            return true;
        }

        public async Task<bool> DeleteTripAsync(double id)
        {
            var trip = await _repo.GetByIdAsync(id);
            if (trip == null) return false;

            await _repo.DeleteAsync(trip);
            return true;
        }
    }
}