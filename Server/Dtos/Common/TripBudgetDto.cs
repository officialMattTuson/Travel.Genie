namespace Travel.Genie.Dtos.Common;

public sealed record TripBudgetDto
{
    public string CurrencyCode { get; init; } = "AUD"; // ISO 4217
    public decimal TotalBudget { get; init; }          // Whole-trip budget
    public decimal? DailyTarget { get; init; }         // Optional per-day target
}
