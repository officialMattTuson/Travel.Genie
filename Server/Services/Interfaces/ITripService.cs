using Travel.Genie.Models.Trips;

namespace Travel.Genie.Services.Interfaces
{
    public interface ITripService
    {
        Task<IEnumerable<TripDetails>> GetTripsAsync();
        Task<TripDetails?> GetTripByIdAsync(double id);
        Task<TripDetails> CreateTripAsync(TripDetails trip);
        Task<bool> UpdateTripAsync(double id, TripDetails update);
        Task<bool> DeleteTripAsync(double id);
    }
}