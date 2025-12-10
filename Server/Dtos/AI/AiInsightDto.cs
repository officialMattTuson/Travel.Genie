using Travel.Genie.Dtos.AI.Enums;

namespace Travel.Genie.Dtos.AI;

public sealed record AiInsightDto
{
    public string Title { get; init; } = default!;
    public string Body { get; init; } = default!;
    public AiInsightType Type { get; init; }
}
