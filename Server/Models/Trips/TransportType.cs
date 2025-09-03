namespace Server.Models.Trips
{
  public class TransportType
  {
    public int Id { get; set; }
    public required string Name { get; set; }
    public ICollection<TripDetails> TripDetails { get; set; } = new List<TripDetails>();
  }
}