using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Travel.Genie.Models.Trips;

namespace Travel.Genie.Data.Configurations
{
    public class TripDetailsConfiguration : IEntityTypeConfiguration<TripDetails>
    {
        public void Configure(EntityTypeBuilder<TripDetails> builder)
        {
            builder.HasKey(td => td.Id);

            builder.Property(td => td.Id)
                .ValueGeneratedOnAdd();

            builder.Property(td => td.Destination)
                .IsRequired()
                .HasMaxLength(256);

            builder.Property(td => td.StartDate)
                .IsRequired();

            builder.Property(td => td.EndDate)
                .IsRequired();

            builder.Property(td => td.Status)
                .IsRequired()
                .HasMaxLength(50);

            builder.Property(td => td.CurrencyCode)
                .IsRequired()
                .HasMaxLength(10);

            builder.Property(td => td.BudgetedPrice)
                .IsRequired();

            builder.Property(td => td.KeepToBudget)
                .IsRequired();

            builder.Property(td => td.ActualPrice)
                .HasDefaultValue(0);

            builder.Property(td => td.Itinerary)
                .IsRequired()
                .HasConversion<int>();

            builder.Property(td => td.TripType)
                .IsRequired()
                .HasConversion<int>();

            builder.Property(td => td.CreatedAt)
                .IsRequired();

            builder.Property(td => td.UpdatedAt)
                .IsRequired();

            builder.Property(td => td.UserId)
                .IsRequired();

            // Index for faster queries
            builder.HasIndex(td => td.UserId);
            builder.HasIndex(td => td.Status);
        }
    }
}
