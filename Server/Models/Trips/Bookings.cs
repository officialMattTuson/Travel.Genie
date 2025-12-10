namespace Travel.Genie.Models.Trips
{
  public class Booking
  {
    public required string Id { get; set; }
    public required Guid TripId { get; set; }
    public required Guid UserId { get; set; }
    public required DateTimeOffset CreatedAt { get; set; }
    public required DateTimeOffset UpdatedAt { get; set; }
    public required BookingType BookingType { get; set; }
  }
}