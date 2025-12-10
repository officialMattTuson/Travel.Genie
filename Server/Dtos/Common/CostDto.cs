namespace Travel.Genie.Dtos.Common;

public sealed record CostDto
{
    public decimal Amount { get; init; }
    public string CurrencyCode { get; init; } = "AUD";
    public bool IsEstimated { get; init; }
}
