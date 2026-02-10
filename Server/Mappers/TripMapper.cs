using Travel.Genie.Dtos.Trip;
using Travel.Genie.Dtos.Itinerary;
using Travel.Genie.Models.Trips;

namespace Travel.Genie.Mappers;

public static class TripMapper
{
    public static TripDetailDto ToDto(this Trip trip)
    {
        return new TripDetailDto
        {
            Id = trip.Id,
            Name = trip.Name,
            Description = trip.Description,
            StartDate = trip.StartDate.ToString("O"),
            EndDate = trip.EndDate.ToString("O"),
            Status = trip.Status,
            PrimaryDestination = trip.PrimaryDestination.ToDto(),
            Destinations = trip.Destinations.Select(d => d.ToDto()).ToList(),
            Budget = trip.Budget?.ToDto(),
            Companions = trip.Companions.Select(c => c.ToDto()).ToList(),
            ItineraryDays = trip.ItineraryDays.Select(d => d.ToDto()).ToList(),
            HasAiGeneratedPlan = trip.HasAiGeneratedPlan,
            LastAiPlanUpdatedAt = trip.LastAiPlanUpdatedAt?.ToString("O")
        };
    }

    public static DestinationDto ToDto(this Destination destination)
    {
        return new DestinationDto
        {
            Id = destination.Id,
            Name = destination.Name,
            CountryCode = destination.CountryCode,
            Latitude = destination.Latitude,
            Longitude = destination.Longitude,
            TimeZoneId = destination.TimeZoneId
        };
    }

    public static TravelCompanionDto ToDto(this TravelCompanion companion)
    {
        return new TravelCompanionDto
        {
            Id = companion.Id,
            Name = companion.Name,
            Age = companion.Age,
            IsChild = companion.IsChild,
            SharesCosts = companion.SharesCosts
        };
    }

    public static TripBudgetDto ToDto(this TripBudget budget)
    {
        return new TripBudgetDto
        {
            CurrencyCode = budget.CurrencyCode,
            TotalBudget = budget.TotalBudget,
            DailyTarget = budget.DailyTarget
        };
    }
}
