using Travel.Genie.Dtos.Itinerary;
using Travel.Genie.Dtos.Common;
using Travel.Genie.Models.Trips;

namespace Travel.Genie.Mappers;

public static class ItineraryMapper
{
    public static ItineraryDayDto ToDto(this ItineraryDay day)
    {
        return new ItineraryDayDto
        {
            Id = day.Id,
            Date = day.Date,
            DayNumber = day.DayNumber,
            Summary = day.Summary,
            Items = day.Items.Select(i => i.ToDto()).ToList()
        };
    }

    public static ItineraryItemDto ToDto(this ItineraryItem item)
    {
        return new ItineraryItemDto
        {
            Id = item.Id,
            Type = Enum.Parse<Dtos.Itinerary.Enums.ItineraryItemType>(item.Type),
            Title = item.Title,
            Description = item.Description,
            StartTime = item.StartTime,
            EndTime = item.EndTime,
            Place = item.Place?.ToDto(),
            Cost = item.Cost?.ToDto(),
            Transport = item.Transport?.ToDto(),
            Accommodation = item.Accommodation?.ToDto(),
            IsAiSuggested = item.IsAiSuggested,
            IsUserEdited = item.IsUserEdited
        };
    }

    public static PlaceDto ToDto(this Place place)
    {
        return new PlaceDto
        {
            Name = place.Name,
            Address = place.Address,
            Latitude = place.Latitude,
            Longitude = place.Longitude,
            GooglePlaceId = place.GooglePlaceId
        };
    }

    public static CostDto ToDto(this Cost cost)
    {
        return new CostDto
        {
            Amount = cost.Amount,
            CurrencyCode = cost.CurrencyCode,
            IsEstimated = cost.IsEstimated
        };
    }

    public static TransportInfoDto ToDto(this TransportInfo transport)
    {
        return new TransportInfoDto
        {
            Mode = Enum.Parse<Dtos.Itinerary.Enums.TransportMode>(transport.Mode),
            From = transport.FromPlace?.ToDto() ?? new PlaceDto(),
            To = transport.ToPlace?.ToDto() ?? new PlaceDto(),
            BookingReference = transport.BookingReference,
            CarrierName = transport.CarrierName,
            TransportNumber = transport.TransportNumber
        };
    }

    public static AccommodationInfoDto ToDto(this AccommodationInfo accommodation)
    {
        return new AccommodationInfoDto
        {
            ProviderName = accommodation.ProviderName,
            ProviderType = accommodation.ProviderType,
            Location = accommodation.Location?.ToDto() ?? new PlaceDto(),
            CheckInDate = accommodation.CheckInDate,
            CheckOutDate = accommodation.CheckOutDate,
            BookingReference = accommodation.BookingReference,
            BookingPlatform = accommodation.BookingPlatform
        };
    }
}
