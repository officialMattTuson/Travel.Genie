namespace Travel.Genie.Models.Trips
{
  public class TripDetails
  {
    public double Id { get; set; }
    public required string Destination { get; set; }
    public DateTimeOffset StartDate { get; set; }
    public DateTimeOffset EndDate { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }
    public required Guid UserId { get; set; }
    public required string Status { get; set; }
    public required string CurrencyCode { get; set; }
    public required double BudgetedPrice { get; set; }
    public required bool KeepToBudget { get; set; }
    public double ActualPrice { get; set; }
    public required ItineraryType Itinerary { get; set; }
    public required TripType TripType { get; set; }
  public ICollection<TransportType> TransportTypes { get; set; } = new List<TransportType>();
  }
}