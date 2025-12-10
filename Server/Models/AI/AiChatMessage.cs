using Travel.Genie.Models.Trips;

namespace Travel.Genie.Models.AI
{
    public class AiChatMessage
    {
        public Guid Id { get; set; }
        public Guid TripId { get; set; }
        public DateTimeOffset CreatedAt { get; set; }
        public string Sender { get; set; } = default!;
        public required string Message { get; set; }

        public Trip? Trip { get; set; }
    }
}
