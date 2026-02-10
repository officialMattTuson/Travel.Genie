using Travel.Genie.Dtos.Trip;
using Travel.Genie.Models.Trips;

namespace Travel.Genie.Mappers;

public static class TripDetailsMapper
{
    public static TripDetailDto ToDto(this TripDetails tripDetails)
    {
        return new TripDetailDto
        {
            Destination = tripDetails.Destination,
            StartDate = tripDetails.StartDate,
            EndDate = tripDetails.EndDate,
            CreatedAt = tripDetails.CreatedAt,
            UpdatedAt = tripDetails.UpdatedAt,
            Status = tripDetails.Status,
            CurrencyCode = tripDetails.CurrencyCode,
            BudgetedPrice = tripDetails.BudgetedPrice,
            KeepToBudget = tripDetails.KeepToBudget,
            ActualPrice = tripDetails.ActualPrice,
            Itinerary = tripDetails.Itinerary,
            TripType = tripDetails.TripType,
            TransportTypes = tripDetails.TransportTypes.ToList()
        };
    }

    public static TripDetails ToModel(this TripDetailDto dto, Guid userId)
    {
        return new TripDetails
        {
            Destination = dto.Destination,
            StartDate = dto.StartDate,
            EndDate = dto.EndDate,
            CreatedAt = dto.CreatedAt,
            UpdatedAt = dto.UpdatedAt,
            UserId = userId,
            Status = dto.Status,
            CurrencyCode = dto.CurrencyCode,
            BudgetedPrice = dto.BudgetedPrice,
            KeepToBudget = dto.KeepToBudget,
            ActualPrice = dto.ActualPrice,
            Itinerary = dto.Itinerary,
            TripType = dto.TripType,
            TransportTypes = dto.TransportTypes.ToList()
        };
    }
}
