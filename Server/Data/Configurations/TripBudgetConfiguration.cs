using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Travel.Genie.Models.Trips;

namespace Travel.Genie.Data.Configurations
{
    public class TripBudgetConfiguration : IEntityTypeConfiguration<TripBudget>
    {
        public void Configure(EntityTypeBuilder<TripBudget> builder)
        {
            builder.HasKey(b => b.Id);

            builder.Property(b => b.CurrencyCode)
                .IsRequired()
                .HasMaxLength(3)
                .HasDefaultValue("AUD");

            builder.Property(b => b.TotalBudget)
                .HasPrecision(18, 2);

            builder.Property(b => b.DailyTarget)
                .HasPrecision(18, 2);

            builder.HasIndex(b => b.TripId)
                .IsUnique();
        }
    }
}
