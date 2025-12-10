namespace Travel.Genie.Models.Trips
{
    public class Cost
    {
        public Guid Id { get; set; }
        public Guid ItineraryItemId { get; set; }
        public decimal Amount { get; set; }
        public string CurrencyCode { get; set; } = "AUD";
        public bool IsEstimated { get; set; }

        public ItineraryItem? ItineraryItem { get; set; }
    }
}
