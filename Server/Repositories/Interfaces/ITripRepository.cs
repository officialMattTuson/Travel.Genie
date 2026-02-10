using Travel.Genie.Dtos.Trip;
using Travel.Genie.Models.Trips;

namespace Travel.Genie.Repositories.Interfaces
{
    public interface ITripRepository
    {
        Task<IReadOnlyList<TripDetailDto>> GetAllAsync(CancellationToken cancellationToken);
        Task<Trip?> GetByIdAsync(Guid userId, Guid tripId, CancellationToken cancellationToken);
        Task<IReadOnlyList<TripDetailDto>> GetTripDtosByUserIdAsync(Guid userId, CancellationToken cancellationToken);
        Task<Trip> AddAsync(Trip trip, CancellationToken cancellationToken);
        Task<bool> UpdateAsync(Guid userId, Guid tripId, Trip update, CancellationToken cancellationToken);
        Task<bool> DeleteAsync(Guid userId, Guid tripId, CancellationToken cancellationToken);
        Task<bool> ExistsAsync(Guid userId, Guid tripId, CancellationToken cancellationToken);
    }
}