using Travel.Genie.Dtos.AI.Enums;

namespace Travel.Genie.Dtos.AI;

public sealed record AiChatMessageDto
{
    public Guid Id { get; init; }
    public Guid TripId { get; init; }
    public DateTimeOffset CreatedAt { get; init; }
    public AiChatSender Sender { get; init; }
    public string Message { get; init; } = default!;
}
