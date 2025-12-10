namespace Travel.Genie.Dtos.Trip;

public sealed record TravelCompanionDto
{
    public Guid Id { get; init; }
    public string Name { get; init; } = default!;
    public int? Age { get; init; }
    public bool IsChild { get; init; }
    public bool SharesCosts { get; init; }
}
