using Travel.Genie.Models.Trips;
using Travel.Genie.Repositories.Interfaces;
using Travel.Genie.Services.Interfaces;
using Travel.Genie.Dtos.Trip;
using Travel.Genie.Mappers;
using System.Threading;
using Microsoft.Extensions.Logging;

namespace Travel.Genie.Services
{
    public class TripService : ITripService
    {
        private readonly ITripRepository _tripsRepository;
        private readonly ILogger<TripService> _logger;

        public TripService(ITripRepository tripsRepository, ILogger<TripService> logger)
        {
            _tripsRepository = tripsRepository;
            _logger = logger;
        }

        public async Task<IReadOnlyList<TripDetailDto>> GetTripsAsync(CancellationToken cancellationToken)
        {
            return await _tripsRepository.GetAllAsync(cancellationToken);
        }

        public async Task<IReadOnlyList<TripDetailDto>> GetTripsByUserIdAsync(Guid userId, CancellationToken cancellationToken) 
        {
            if (userId == Guid.Empty)
            {
                return Array.Empty<TripDetailDto>();
            }
            return await _tripsRepository.GetTripDtosByUserIdAsync(userId, cancellationToken);
        }

        public async Task<TripDetails?> GetTripByIdAsync(Guid userId, Guid tripId, CancellationToken cancellationToken) 
        {
            return await _tripsRepository.GetByIdAsync(userId, tripId, cancellationToken); 
        }

        public async Task<TripDetails> CreateTripAsync(TripDetails trip, CancellationToken cancellationToken)
        {
            trip.CreatedAt = DateTimeOffset.UtcNow;
            trip.UpdatedAt = DateTimeOffset.UtcNow;
            return await _tripsRepository.AddAsync(trip, cancellationToken);
        }

        public async Task<bool> UpdateTripAsync(Guid userId, Guid tripId, TripDetails update, CancellationToken cancellationToken)
        {
            return await _tripsRepository.UpdateAsync(userId, tripId, update, cancellationToken);
        }

        public async Task<bool> DeleteTripAsync(Guid userId, Guid tripId, CancellationToken cancellationToken)
        {
            return await _tripsRepository.DeleteAsync(userId, tripId, cancellationToken);
        }
    }
}