using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Travel.Genie.Models.Trips;

namespace Travel.Genie.Data.Configurations
{
    public class CostConfiguration : IEntityTypeConfiguration<Cost>
    {
        public void Configure(EntityTypeBuilder<Cost> builder)
        {
            builder.HasKey(c => c.Id);

            builder.Property(c => c.Amount)
                .IsRequired()
                .HasPrecision(18, 2);

            builder.Property(c => c.CurrencyCode)
                .IsRequired()
                .HasMaxLength(3)
                .HasDefaultValue("AUD"); // ISO 4217

            builder.HasIndex(c => c.ItineraryItemId)
                .IsUnique();
        }
    }
}
