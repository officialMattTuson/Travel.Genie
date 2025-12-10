namespace Travel.Genie.Models.Trips
{
    public class TripBudget
    {
        public Guid Id { get; set; }
        public Guid TripId { get; set; }
        public string CurrencyCode { get; set; } = "AUD"; // ISO 4217
        public decimal TotalBudget { get; set; }
        public decimal? DailyTarget { get; set; }

        public Trip? Trip { get; set; }
    }
}
