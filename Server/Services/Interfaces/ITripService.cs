using Travel.Genie.Dtos.Trip;
using Travel.Genie.Models.Trips;

namespace Travel.Genie.Services.Interfaces
{
    public interface ITripService
    {
        Task<IReadOnlyList<TripDetailDto>> GetTripsAsync(CancellationToken cancellationToken);
        Task<IReadOnlyList<TripDetailDto>> GetTripsByUserIdAsync(Guid userId, CancellationToken cancellationToken);
        Task<TripDetails?> GetTripByIdAsync(Guid userId, Guid tripId, CancellationToken cancellationToken);
        Task<TripDetails> CreateTripAsync(TripDetails trip, CancellationToken cancellationToken);
        Task<bool> UpdateTripAsync(Guid userId, Guid tripId, TripDetails update, CancellationToken cancellationToken);
        Task<bool> DeleteTripAsync(Guid userId, Guid tripId, CancellationToken cancellationToken);
    }
}