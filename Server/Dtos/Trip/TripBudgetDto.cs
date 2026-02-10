namespace Travel.Genie.Dtos.Trip;

public sealed record TripBudgetDto
{
    public string CurrencyCode { get; init; } = "USD";
    public decimal TotalBudget { get; init; }
    public decimal? DailyTarget { get; init; }
}
