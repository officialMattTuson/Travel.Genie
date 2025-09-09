using Travel.Genie.Models.Trips;

namespace Travel.Genie.Repositories.Interfaces
{
    public interface ITripRepository
    {
        Task<IEnumerable<TripDetails>> GetAllAsync();
        Task<TripDetails?> GetByIdAsync(double id);
        Task<TripDetails> AddAsync(TripDetails trip);
        Task UpdateAsync(TripDetails trip);
        Task DeleteAsync(TripDetails trip);
        Task<bool> ExistsAsync(double id);
    }
}