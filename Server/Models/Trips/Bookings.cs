namespace Server.Models.Trips
{
  public class Booking
  {
    public required string Id { get; set; }
    public required double TripId { get; set; }
    public required double UserId { get; set; }
    public required DateTimeOffset CreatedAt { get; set; }
    public required DateTimeOffset UpdatedAt { get; set; }
    public required BookingType BookingType { get; set; }
  }
}