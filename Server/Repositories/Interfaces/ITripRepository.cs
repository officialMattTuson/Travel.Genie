using Travel.Genie.Dtos.Trip;
using Travel.Genie.Models.Trips;

namespace Travel.Genie.Repositories.Interfaces
{
    public interface ITripRepository
    {
        Task<IReadOnlyList<TripDetailDto>> GetAllAsync(CancellationToken cancellationToken);
        Task<TripDetails?> GetByIdAsync(Guid userId, Guid tripId, CancellationToken cancellationToken);
        Task<IReadOnlyList<TripDetailDto>> GetTripDtosByUserIdAsync(Guid userId, CancellationToken cancellationToken);
        Task<TripDetails> AddAsync(TripDetails trip, CancellationToken cancellationToken);
        Task<bool> UpdateAsync(Guid userId, Guid tripId, TripDetails update, CancellationToken cancellationToken);
        Task<bool> DeleteAsync(Guid userId, Guid tripId, CancellationToken cancellationToken);
        Task<bool> ExistsAsync(Guid userId, Guid tripId, CancellationToken cancellationToken);
    }
}